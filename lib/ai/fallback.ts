// Deterministic, offline itinerary generator.
//
// When ANTHROPIC_API_KEY is set, lib/ai/orchestrator.ts produces specific, named
// recommendations via Claude. With no key, this builds a schema-valid itinerary from
// the curated destination seed so the product works out of the box. It stays honest
// per the brand voice: it anchors days in real neighborhoods and real practical info,
// and does NOT fabricate specific restaurant/hotel names — those are what the live AI
// adds. Tokyo returns the golden benchmark itinerary as the showcase.
import type { Itinerary, Day, Activity, Stay, HotelOption } from '@/lib/types/itinerary'
import type { TripRequest } from '@/lib/types/request'
import { PROMPT_VERSION } from './prompts'
import { destinationByCity, type Destination } from '@/lib/data/destinations'
import { goldenTokyo } from '@/lib/data/golden-tokyo'

type Vibe = 'foodie' | 'art' | 'nightlife' | 'outdoor' | 'family' | 'history' | 'relaxed' | 'general'

function classifyVibes(tags: string[], freeform = ''): Vibe[] {
  const hay = (tags.join(' ') + ' ' + freeform).toLowerCase()
  const out: Vibe[] = []
  if (/food|eat|restaurant|culinary|dining|ramen|taco|wine|coffee/.test(hay)) out.push('foodie')
  if (/art|gallery|museum|design|architecture/.test(hay)) out.push('art')
  if (/night|bar|club|jazz|music|party/.test(hay)) out.push('nightlife')
  if (/hike|outdoor|nature|beach|mountain|surf|road trip|ring road/.test(hay)) out.push('outdoor')
  if (/kid|child|family|teen/.test(hay)) out.push('family')
  if (/history|temple|historic|heritage|ancient|culture/.test(hay)) out.push('history')
  if (/slow|relax|chill|honeymoon|spa|romantic|couple/.test(hay)) out.push('relaxed')
  return out.length ? out : ['general']
}

function tierFor(req: TripRequest): HotelOption['tier'][] {
  switch (req.budgetTier) {
    case 'shoestring':
    case 'budget':
      return ['budget', 'mid']
    case 'luxury':
      return ['luxury', 'boutique']
    case 'comfortable':
      return ['boutique', 'comfortable' as never].filter(Boolean) as HotelOption['tier'][]
    default:
      return ['mid', 'boutique', 'budget']
  }
}

const PRICE_BY_TIER: Record<string, number> = { budget: 95, mid: 170, boutique: 280, luxury: 460 }

function morningFor(vibes: Vibe[], dest: Destination, n: Destination['topNeighborhoods'][number]): Activity {
  if (vibes.includes('foodie'))
    return {
      time: '09:30', durationMinutes: 75, title: `Coffee and a slow start in ${n.name}`, type: 'cafe',
      description: `Begin in ${n.name} — ${n.vibe}. Find a café with morning regulars, order what the counter recommends, and watch the neighborhood wake up before the day's eating begins.`,
      whyThis: 'Mornings set the pace. Eat light here so the big meals later land.',
      bookingRequired: false, affiliateLinks: [],
      location: { name: n.name, neighborhood: n.name },
    }
  if (vibes.includes('outdoor'))
    return {
      time: '08:30', durationMinutes: 150, title: `Get outside near ${n.name}`, type: 'outdoor',
      description: `Start early while the light is good and the crowds are thin. ${n.name} (${n.vibe}) is a strong base for a morning walk or viewpoint before the day heats up.`,
      whyThis: 'Outdoor plans reward early starts — weather and crowds both turn by midday.',
      bookingRequired: false, affiliateLinks: [],
      location: { name: n.name, neighborhood: n.name },
    }
  return {
    time: '09:30', durationMinutes: 90, title: `Wander ${n.name}`, type: 'explore',
    description: `Ease in on foot through ${n.name} — ${n.vibe}. No agenda beyond getting your bearings, finding a coffee, and noting places to come back to.`,
    whyThis: `Best for: ${n.bestFor.join(', ')}. Walking a neighborhood first makes the rest of the day legible.`,
    bookingRequired: false, affiliateLinks: [],
    location: { name: n.name, neighborhood: n.name },
  }
}

function middayFor(vibes: Vibe[], dest: Destination, n: Destination['topNeighborhoods'][number]): Activity {
  if (vibes.includes('art'))
    return {
      time: '11:30', durationMinutes: 120, title: `Art and design in ${n.name}`, type: 'gallery',
      description: `Spend late morning with the galleries and small museums around ${n.name}. Go for one or two spaces you can actually absorb rather than a checklist.`,
      whyThis: 'Two rooms looked at well beats ten walked through.',
      bookingRequired: true, affiliateLinks: [],
      location: { name: n.name, neighborhood: n.name },
    }
  if (vibes.includes('history'))
    return {
      time: '11:00', durationMinutes: 120, title: `The historic core around ${n.name}`, type: 'sightseeing',
      description: `Work through the older streets and landmark sites near ${n.name}. Go before the midday tour groups arrive; the same square is a different place at 11 than at 2.`,
      whyThis: 'Timing beats itinerary length at the marquee sights.',
      bookingRequired: true, affiliateLinks: [],
      location: { name: n.name, neighborhood: n.name },
    }
  if (vibes.includes('family'))
    return {
      time: '11:00', durationMinutes: 120, title: `Something for the whole group in ${n.name}`, type: 'experience',
      description: `A midday activity in ${n.name} that works across ages — a park, a hands-on museum, or a market with room to roam. Build in a snack stop and a sit-down.`,
      whyThis: 'With kids, one good anchor activity per half-day beats three rushed ones.',
      bookingRequired: true, affiliateLinks: [],
      location: { name: n.name, neighborhood: n.name },
    }
  return {
    time: '12:00', durationMinutes: 90, title: `Lunch and a look around ${n.name}`, type: 'restaurant',
    description: `Eat where ${n.name} eats — a counter or market spot, not a sit-down with a view. Then keep wandering on a full stomach.`,
    bookingRequired: false, affiliateLinks: [],
    location: { name: `${n.name} lunch`, neighborhood: n.name },
  }
}

function eveningFor(vibes: Vibe[], dest: Destination, n: Destination['topNeighborhoods'][number]): Activity[] {
  const dinner: Activity = {
    time: '19:30', durationMinutes: 120, title: `Dinner in ${n.name}`, type: 'restaurant',
    description: `Anchor the evening with a proper dinner in ${n.name}. ${vibes.includes('foodie') ? 'This is the night to book ahead and spend a little — make it the meal you remember.' : 'Pick one good room and linger; you do not need to rush to a second thing.'}`,
    tips: ['Book a few days ahead for weekend nights', 'Ask staff what is best that day'],
    bookingRequired: false, affiliateLinks: [],
    location: { name: `${n.name} dinner`, neighborhood: n.name },
  }
  if (vibes.includes('nightlife'))
    return [dinner, {
      time: '22:00', durationMinutes: 90, title: `A bar worth staying at in ${n.name}`, type: 'bar',
      description: `End the night somewhere in ${n.name} that knows what it is — a cocktail bar, a wine spot, or live music. One good room beats bar-hopping.`,
      bookingRequired: false, affiliateLinks: [],
      location: { name: `${n.name} nightcap`, neighborhood: n.name },
    }]
  return [dinner]
}

export function generateItineraryFallback(request: TripRequest): Itinerary {
  const dest = destinationByCity(request.destinationRaw)

  // Tokyo showcase: hand it the golden itinerary, retimed to requested duration.
  if (dest?.slug === 'tokyo' && (!request.durationDays || request.durationDays === 4)) {
    return {
      ...goldenTokyo,
      metadata: { generatedAt: new Date().toISOString(), model: 'stitch-offline-sample', promptVersion: PROMPT_VERSION },
    }
  }

  const cityName = dest?.city ?? titleCase(request.destinationRaw)
  const country = dest?.country ?? 'your destination'
  const duration = clamp(request.durationDays ?? 4, 1, 14)
  const vibes = classifyVibes(request.vibeTags, request.interestsFreeform)
  const hoods = dest?.topNeighborhoods ?? [
    { name: 'the center', vibe: 'central and walkable', bestFor: ['first-timers'] },
    { name: 'the old quarter', vibe: 'historic and atmospheric', bestFor: ['history'] },
  ]

  const days: Day[] = []
  for (let i = 0; i < duration; i++) {
    const n = hoods[i % hoods.length]
    const activities: Activity[] = []
    if (i === 0) {
      activities.push({
        time: '15:00', durationMinutes: 90, title: `Arrive and settle into ${n.name}`, type: 'explore',
        description: `Drop your bags and take it easy. A short walk around ${n.name} (${n.vibe}), a coffee, an early dinner nearby. Day one is for landing, not for sightseeing.`,
        whyThis: 'Front-loading a packed day after travel is how trips start tired. Ease in.',
        bookingRequired: false, affiliateLinks: [],
        location: { name: n.name, neighborhood: n.name },
      })
      activities.push(...eveningFor(vibes, dest!, n))
    } else {
      activities.push(morningFor(vibes, dest!, n))
      activities.push(middayFor(vibes, dest!, n))
      activities.push({
        time: '16:00', durationMinutes: 90, title: `Afternoon in ${n.name}`, type: 'explore',
        description: `Slow afternoon in ${n.name}. Shops, a park bench, a second coffee — leave room for the accidental discovery that ends up being the day's best part.`,
        bookingRequired: false, affiliateLinks: [],
        location: { name: n.name, neighborhood: n.name },
      })
      activities.push(...eveningFor(vibes, dest!, n))
    }
    days.push({
      dayNumber: i + 1,
      title: i === 0 ? `Arrival and ${hoods[0].name}` : `${cap(n.name)} day`,
      narrative: i === 0
        ? `Land, settle in ${hoods[0].name}, and keep the first evening low-key. ${dest ? dest.overviewMarkdown.split('. ')[0] + '.' : ''}`
        : `Today centers on ${n.name} — ${n.vibe}. ${vibeNote(vibes)}`,
      activities,
    })
  }

  const tiers = tierFor(request)
  const baseHood = hoods[0]
  const stay: Stay = {
    nightRange: `${duration} night${duration > 1 ? 's' : ''}`,
    neighborhood: baseHood.name,
    rationale: `Base in ${baseHood.name} — ${baseHood.vibe}. For a trip this length, staying put beats splitting neighborhoods; you lose half a day every time you move hotels.`,
    options: tiers.slice(0, 3).map((tier, idx) => ({
      name: `${cap(baseHood.name)} ${tier === 'luxury' ? 'flagship hotel' : tier === 'boutique' ? 'boutique stay' : tier === 'budget' ? 'guesthouse' : 'hotel'}`,
      tier,
      estimatedPriceUsdPerNight: PRICE_BY_TIER[tier] ?? 170,
      rating: 4.5 - idx * 0.1,
      amenities: tier === 'luxury' ? ['central', 'spa', 'bar'] : tier === 'budget' ? ['central', 'simple'] : ['central', 'well-designed'],
      location: { name: baseHood.name, neighborhood: baseHood.name },
      rationale: `A ${tier} option in ${baseHood.name}. Use the booking links to find current rates and exact properties — these are search anchors, not fabricated listings.`,
      affiliateLinks: [],
    })),
  }

  const it: Itinerary = {
    schemaVersion: 1,
    destination: {
      primaryCity: cityName,
      country,
      countryCode: dest?.countryCode,
      lat: dest?.lat,
      lng: dest?.lng,
      regionsVisited: hoods.slice(0, Math.min(hoods.length, duration)).map((h) => h.name),
    },
    dates: {
      start: request.startDate,
      end: request.endDate,
      flexible: request.flexibleDates,
      durationDays: duration,
      season: dest ? `Best months: ${dest.bestTimeToVisit.months.join(', ')}` : undefined,
    },
    travelers: {
      adults: request.adults,
      children: request.children,
      relationship: (request.relationship as Itinerary['travelers']['relationship']) ?? undefined,
    },
    preferences: {
      vibeTags: request.vibeTags,
      budgetTotalUsd: request.budgetTotalUsd,
      budgetTier: request.budgetTier,
      pace: request.pace ?? 'moderate',
      dietary: request.dietary,
      accessibility: request.accessibility,
      interestsFreeform: request.interestsFreeform,
    },
    summary: `A ${duration}-day ${cityName} trip${vibes[0] !== 'general' ? ` built around ${vibes.join(', ')}` : ''}, anchored in ${baseHood.name}. ${dest ? dest.overviewMarkdown.split('. ').slice(0, 2).join('. ') + '.' : 'Specific named places, prices, and bookings come from the live planner when an Anthropic API key is configured.'}`,
    preTrip: dest ? {
      currencyNotes: `Currency: ${dest.practical.currency}.`,
      packingTips: [`Pack for ${dest.bestTimeToVisit.notes}`, 'Comfortable walking shoes', `Plug type ${dest.practical.plugType}, ${dest.practical.voltage}`],
      insuranceRecommendations: [],
      esimRecommendations: [],
      appsToInstall: [],
    } : { insuranceRecommendations: [], esimRecommendations: [], packingTips: [], appsToInstall: [] },
    stays: [stay],
    days,
    restaurantsAppendix: [],
    gettingAround: dest ? {
      walkability: `${baseHood.name} is the most walkable base. Beyond it, use local transit.`,
      intercityTransport: [],
    } : undefined,
    practical: dest ? {
      emergencyNumber: dest.practical.emergencyNumber,
      plugType: dest.practical.plugType,
      voltage: dest.practical.voltage,
      tipping: dest.practical.tipping,
      commonPhrases: [],
    } : undefined,
    metadata: { generatedAt: new Date().toISOString(), model: 'stitch-offline-generator', promptVersion: PROMPT_VERSION },
  }

  return it
}

function vibeNote(vibes: Vibe[]): string {
  if (vibes.includes('foodie')) return 'Built around eating well, with room to walk it off between meals.'
  if (vibes.includes('art')) return 'Weighted toward galleries and design, kept to a pace you can absorb.'
  if (vibes.includes('outdoor')) return 'Outdoors-first, with early starts and unhurried afternoons.'
  if (vibes.includes('family')) return 'Paced for a group, with one solid anchor activity and space to rest.'
  if (vibes.includes('history')) return 'Centered on the historic sights, timed around the crowds.'
  if (vibes.includes('relaxed')) return 'Deliberately slow — fewer stops, longer at each.'
  return 'A balanced day with room to wander.'
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const titleCase = (s: string) => s.trim().replace(/\b\w/g, (c) => c.toUpperCase()) || 'Your trip'
