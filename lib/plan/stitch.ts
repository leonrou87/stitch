// The stitching engine. Takes the places a user picked and arranges them into a coherent
// day-by-day itinerary — clustering by neighborhood to minimize hopping, slotting each
// place into the daypart it belongs in, anchoring lunch and dinner, and pacing the day.
// Pure and deterministic: no LLM. Outputs the canonical Itinerary so the existing
// renderer, affiliate enrichment, and /i/[slug] all work unchanged.
import type { Itinerary, Day, Activity, Stay, FlightOption } from '@/lib/types/itinerary'
import type { Place, Daypart, PlaceCategory } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'
import { PROMPT_VERSION } from '@/lib/ai/prompts'

const DAYPART_ORDER: Daypart[] = ['morning', 'midday', 'afternoon', 'evening', 'latenight']
const SLOT_TIME: Record<Daypart, string> = {
  morning: '09:30', midday: '12:30', afternoon: '15:30', evening: '19:30', latenight: '22:00',
}

const CATEGORY_TYPE: Record<PlaceCategory, Activity['type']> = {
  cafe: 'cafe', food: 'restaurant', bar: 'bar', sight: 'sightseeing', gallery: 'gallery',
  experience: 'experience', outdoor: 'outdoor', shop: 'shopping', market: 'explore', stay: 'rest',
}

function estCost(p: Place): number {
  if (['food', 'bar', 'cafe'].includes(p.category)) return [0, 14, 38, 80, 165][p.priceLevel]
  if (['sight', 'gallery', 'experience', 'outdoor'].includes(p.category)) return [0, 0, 22, 40, 70][p.priceLevel]
  return 0
}

export interface StitchOptions {
  durationDays?: number
  pace?: 'slow' | 'moderate' | 'packed'
  adults?: number
  relationship?: string
  startDate?: string
  flights?: FlightOption[]
  originAirport?: string
}

const PER_DAY_BY_PACE = { slow: 3, moderate: 4, packed: 6 } as const

export function stitchItinerary(citySlug: string, places: Place[], opts: StitchOptions = {}): Itinerary {
  const dest = destinationBySlug(citySlug)
  const picks = places.filter((p) => p.category !== 'stay')
  const pace = opts.pace ?? 'moderate'
  const perDay = PER_DAY_BY_PACE[pace]
  const duration = clamp(opts.durationDays ?? Math.max(1, Math.ceil(picks.length / perDay)), 1, 10)

  const dayGroups = assignToDays(picks, duration, perDay)
  const days: Day[] = dayGroups.map((group, i) => buildDay(group, i + 1, opts.startDate))

  const vibeTags = topVibes(picks)
  const stays = buildStays(picks, dest?.city ?? citySlug, duration)

  const it: Itinerary = {
    schemaVersion: 1,
    destination: {
      primaryCity: dest?.city ?? titleCase(citySlug),
      country: dest?.country ?? '',
      countryCode: dest?.countryCode,
      lat: dest?.lat,
      lng: dest?.lng,
      regionsVisited: uniq(picks.map((p) => p.neighborhood)),
    },
    dates: {
      start: opts.startDate,
      flexible: !opts.startDate,
      durationDays: duration,
      season: dest ? `Best months: ${dest.bestTimeToVisit.months.join(', ')}` : undefined,
    },
    travelers: {
      adults: opts.adults ?? 2,
      children: [],
      relationship: (opts.relationship as Itinerary['travelers']['relationship']) ?? undefined,
    },
    preferences: { vibeTags, pace, dietary: [], accessibility: [] },
    summary: buildSummary(dest?.city ?? titleCase(citySlug), duration, picks, vibeTags),
    preTrip: dest ? {
      currencyNotes: `Currency: ${dest.practical.currency}.`,
      packingTips: [`Pack for ${dest.bestTimeToVisit.notes}`, 'Comfortable walking shoes', `Plug type ${dest.practical.plugType}, ${dest.practical.voltage}`],
      insuranceRecommendations: [],
      esimRecommendations: [],
      appsToInstall: [],
    } : { insuranceRecommendations: [], esimRecommendations: [], packingTips: [], appsToInstall: [] },
    flights: opts.flights && opts.flights.length ? opts.flights : undefined,
    stays,
    days,
    restaurantsAppendix: [],
    gettingAround: dest ? {
      walkability: `${days[0]?.title ?? 'The center'} is your most walkable stretch. Between neighborhoods, use local transit.`,
      intercityTransport: [],
    } : undefined,
    practical: dest ? {
      emergencyNumber: dest.practical.emergencyNumber,
      plugType: dest.practical.plugType,
      voltage: dest.practical.voltage,
      tipping: dest.practical.tipping,
      commonPhrases: [],
    } : undefined,
    metadata: { generatedAt: new Date().toISOString(), model: 'stitch-engine', promptVersion: PROMPT_VERSION },
    source: { citySlug, placeIds: picks.map((p) => p.id), pace, startDate: opts.startDate },
  }
  return it
}

// Group picks into `duration` days, keeping neighborhoods together and balancing load.
function assignToDays(picks: Place[], duration: number, perDay: number): Place[][] {
  const byHood = new Map<string, Place[]>()
  for (const p of picks) {
    const arr = byHood.get(p.neighborhood) ?? []
    arr.push(p)
    byHood.set(p.neighborhood, arr)
  }
  // Largest neighborhoods first so they anchor days.
  const hoods = [...byHood.entries()].sort((a, b) => b[1].length - a[1].length)
  const days: Place[][] = Array.from({ length: duration }, () => [])

  for (const [, group] of hoods) {
    for (const place of group) {
      // Put in the emptiest day that already has this neighborhood, else the emptiest day.
      const sameHood = days
        .map((d, i) => ({ i, d }))
        .filter((x) => x.d.some((p) => p.neighborhood === place.neighborhood))
        .sort((a, b) => a.d.length - b.d.length)
      const target = sameHood.find((x) => x.d.length < perDay)?.i
        ?? days.map((d, i) => ({ i, len: d.length })).sort((a, b) => a.len - b.len)[0].i
      days[target].push(place)
    }
  }
  return days.filter((d) => d.length > 0)
}

function buildDay(group: Place[], dayNumber: number, startDate?: string): Day {
  // Bucket by preferred daypart, then rebalance overloaded buckets into neighbors.
  const buckets = new Map<Daypart, Place[]>()
  for (const p of group) {
    const dp = p.dayparts[0] ?? 'afternoon'
    const arr = buckets.get(dp) ?? []
    arr.push(p)
    buckets.set(dp, arr)
  }

  const activities: Activity[] = []
  for (const dp of DAYPART_ORDER) {
    const inBucket = (buckets.get(dp) ?? []).sort((a, b) => b.durationMins - a.durationMins)
    inBucket.forEach((p, idx) => {
      activities.push(toActivity(p, addMinutes(SLOT_TIME[dp], idx * 90)))
    })
  }

  const hoods = uniq(group.map((p) => p.neighborhood))
  const title = hoods.length === 1 ? hoods[0] : `${hoods[0]} & ${hoods[1]}`
  const dateStr = startDate ? addDays(startDate, dayNumber - 1) : undefined

  return {
    dayNumber,
    date: dateStr,
    title,
    narrative: buildDayNarrative(group, hoods),
    activities: activities.length ? activities : [toActivity(group[0], '10:00')],
  }
}

function toActivity(p: Place, time: string): Activity {
  const tips: string[] = []
  if (p.order) tips.push(`Order: ${p.order}`)
  if (p.tip) tips.push(p.tip)
  if (p.closed) tips.push(`Typically closed: ${p.closed}`)
  return {
    time,
    durationMinutes: p.durationMins,
    title: p.name,
    type: CATEGORY_TYPE[p.category],
    description: p.blurb,
    location: { name: p.name, neighborhood: p.neighborhood, lat: p.lat, lng: p.lng },
    costEstimateUsd: estCost(p),
    tips: tips.length ? tips : undefined,
    bookingRequired: Boolean(p.booking && p.booking !== 'none'),
    affiliateLinks: [], // attached server-side on save via the affiliate registry
  }
}

function buildStays(picks: Place[], city: string, duration: number): Stay[] | undefined {
  if (!picks.length) return undefined
  const hood = mode(picks.map((p) => p.neighborhood)) ?? picks[0].neighborhood
  const tiers: Array<{ tier: Stay['options'][number]['tier']; price: number; label: string }> = [
    { tier: 'mid', price: 170, label: 'hotel' },
    { tier: 'boutique', price: 280, label: 'boutique stay' },
  ]
  return [{
    nightRange: `${duration} night${duration > 1 ? 's' : ''}`,
    neighborhood: hood,
    rationale: `Most of your picks cluster around ${hood}, so base there and you walk to more of your trip. The links find live rates and exact properties.`,
    options: tiers.map((t, idx) => ({
      name: `${hood} ${t.label}`,
      tier: t.tier,
      estimatedPriceUsdPerNight: t.price,
      rating: 4.5 - idx * 0.1,
      amenities: ['central', 'well-located'],
      location: { name: hood, neighborhood: hood },
      rationale: `A ${t.tier} option in ${hood} — a search anchor, not a fabricated listing.`,
      affiliateLinks: [],
    })),
  }]
}

function buildSummary(city: string, duration: number, picks: Place[], vibes: string[]): string {
  const hoods = uniq(picks.map((p) => p.neighborhood))
  const hoodLine = hoods.length > 1 ? `across ${hoods.slice(0, 3).join(', ')}` : `in ${hoods[0] ?? city}`
  const vibeLine = vibes.length ? ` It leans ${vibes.slice(0, 2).join(' and ')}.` : ''
  return `A ${duration}-day ${city} trip built from ${picks.length} hand-picked places ${hoodLine}, arranged to keep each day in one part of town.${vibeLine}`
}

function buildDayNarrative(group: Place[], hoods: string[]): string {
  const food = group.find((p) => p.category === 'food')
  const anchor = group.find((p) => ['sight', 'gallery', 'experience', 'outdoor'].includes(p.category))
  const bits: string[] = [`A day ${hoods.length === 1 ? `in ${hoods[0]}` : `between ${hoods.join(' and ')}`}.`]
  if (anchor) bits.push(`${anchor.name} anchors it`)
  if (food) bits.push(`${anchor ? 'and ' : ''}${food.name} is the meal to plan around`)
  return bits.join(' ').replace(/\.\s+([a-z])/g, (_m, c) => `. ${c.toUpperCase()}`) + (bits.length > 1 ? '.' : '')
}

function topVibes(picks: Place[]): string[] {
  const counts = new Map<string, number>()
  for (const p of picks) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  return [...counts.entries()]
    .filter(([t]) => ['foodie', 'art', 'nightlife', 'outdoor', 'history', 'relaxed', 'family'].includes(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([t]) => t)
}

// helpers
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const uniq = <T,>(a: T[]) => Array.from(new Set(a))
const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
function mode(arr: string[]): string | undefined {
  const c = new Map<string, number>()
  let best: string | undefined
  let bestN = 0
  for (const x of arr) { const n = (c.get(x) ?? 0) + 1; c.set(x, n); if (n > bestN) { bestN = n; best = x } }
  return best
}
function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + mins
  const hh = Math.floor((total % 1440) / 60)
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}
function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
