// Merge engine: stitch each city leg, then concatenate into one trip with an intercity
// transport leg between cities. Pure and deterministic. Output is a normal Itinerary so the
// existing renderer, affiliate enrichment, and save path all work unchanged.
import type { Itinerary, Day } from '@/lib/types/itinerary'
import type { Place } from '@/lib/data/catalog'
import { placesForCity } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'
import { stitchItinerary } from './stitch'

export interface CityLeg { citySlug: string; placeIds: string[]; days: number }

// Rough train/short-flight hops between supported pairs (hours, USD pp). Fallback is generic.
const HOPS: Record<string, { hours: number; usd: number; mode: string }> = {
  'kyoto|tokyo': { hours: 2.2, usd: 120, mode: 'Shinkansen' },
  'london|paris': { hours: 2.3, usd: 90, mode: 'Eurostar' },
  'amsterdam|paris': { hours: 3.3, usd: 80, mode: 'Train' },
  'amsterdam|london': { hours: 4, usd: 100, mode: 'Train' },
}
const hop = (a: string, b: string) => HOPS[[a, b].sort().join('|')] ?? { hours: 3, usd: 90, mode: 'Train' }

export function stitchMultiCity(legs: CityLeg[], opts: { pace?: 'slow' | 'moderate' | 'packed'; startDate?: string } = {}): Itinerary {
  const pace = opts.pace ?? 'moderate'
  const subItins: Itinerary[] = []
  let dayCursor = 0

  for (const leg of legs) {
    const byId = new Map(placesForCity(leg.citySlug).map((p) => [p.id, p]))
    const places = leg.placeIds.map((id) => byId.get(id)).filter((p): p is Place => Boolean(p))
    const legStart = opts.startDate ? addDays(opts.startDate, dayCursor) : undefined
    subItins.push(stitchItinerary(leg.citySlug, places, { durationDays: leg.days, pace, startDate: legStart }))
    dayCursor += leg.days
  }

  // Concatenate + renumber days.
  const days: Day[] = []
  subItins.forEach((it) => it.days.forEach((d) => days.push({ ...d, dayNumber: days.length + 1 })))

  const cities = legs.map((l) => destinationBySlug(l.citySlug)?.city ?? l.citySlug)
  const first = destinationBySlug(legs[0].citySlug)

  // Intercity transport notes between consecutive cities.
  const intercity = legs.slice(1).map((leg, i) => {
    const fromCity = cities[i]
    const toCity = cities[i + 1]
    const h = hop(legs[i].citySlug, leg.citySlug)
    return { from: fromCity, to: toCity, mode: h.mode, durationHours: h.hours, costUsd: h.usd, affiliateLinks: [] }
  })

  const stays = subItins.flatMap((it) => it.stays ?? [])
  const totalDays = legs.reduce((n, l) => n + l.days, 0)
  const vibeTags = Array.from(new Set(subItins.flatMap((it) => it.preferences.vibeTags)))

  return {
    schemaVersion: 1,
    destination: {
      primaryCity: cities.join(' & '),
      country: first?.country ?? '',
      countryCode: first?.countryCode,
      lat: first?.lat,
      lng: first?.lng,
      regionsVisited: cities,
    },
    dates: { start: opts.startDate, flexible: !opts.startDate, durationDays: totalDays },
    travelers: { adults: 2, children: [] },
    preferences: { vibeTags, pace, dietary: [], accessibility: [] },
    summary: `A ${totalDays}-day trip across ${cities.join(' and ')}. ${legs[0].days} days in ${cities[0]}, then ${cities.slice(1).map((c, i) => `${legs[i + 1].days} in ${c}`).join(', ')} — with an easy ${intercity[0]?.mode.toLowerCase() ?? 'train'} hop between them.`,
    preTrip: subItins[0].preTrip,
    stays,
    days,
    restaurantsAppendix: [],
    gettingAround: {
      walkability: 'Each city is walkable around your base; you move between cities by train.',
      intercityTransport: intercity,
    },
    practical: subItins[0].practical,
    metadata: subItins[0].metadata,
    // No single-city source -> in-place day/pace re-stitch is disabled for multi-city (you
    // can still remove stops). Multi-city editing can come later.
  }
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
