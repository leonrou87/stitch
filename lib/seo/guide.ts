// Builds the SEO landing-page taxonomy (content pack §3) and the synthetic trip
// requests behind each duration/niche sample itinerary. Sample itineraries are
// generated deterministically (offline generator) so guide pages render instantly
// with no API cost; swap in the orchestrator + persisted isSeoPage rows for production.
import { destinations, type Destination } from '@/lib/data/destinations'
import { TripRequestSchema, type TripRequest } from '@/lib/types/request'

export const DURATIONS = [2, 3, 4, 5, 7, 10, 14] as const

export const NICHES: Record<string, { label: string; vibeTags: string[]; relationship?: string; childAges?: number[]; freeform: string }> = {
  'for-foodies': { label: 'for foodies', vibeTags: ['foodie'], freeform: 'Food-first trip — markets, standout dinners, neighborhood eating.' },
  'for-couples': { label: 'for couples', vibeTags: ['relaxed'], relationship: 'couple', freeform: 'A couple who like good food, slow mornings, and a little romance.' },
  solo: { label: 'for solo travelers', vibeTags: ['art', 'foodie'], relationship: 'solo', freeform: 'Solo traveler, comfortable wandering and eating at the counter.' },
  'with-kids': { label: 'with kids', vibeTags: ['family'], relationship: 'family', childAges: [6, 9], freeform: 'Family with two kids aged 6 and 9 — needs pacing and downtime.' },
  honeymoon: { label: 'honeymoon', vibeTags: ['relaxed', 'foodie'], relationship: 'couple', freeform: 'Honeymoon — special meals, beautiful stays, no rush.' },
}

export function isDurationSlug(slug: string): number | null {
  const m = slug.match(/^(\d+)-day-itinerary$/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return DURATIONS.includes(n as never) ? n : (n >= 1 && n <= 21 ? n : null)
}

export function guideRequest(dest: Destination, slug: string): { request: TripRequest; title: string; lede: string } | null {
  const duration = isDurationSlug(slug)
  if (duration) {
    return {
      request: TripRequestSchema.parse({
        destinationRaw: dest.city,
        durationDays: duration,
        flexibleDates: true,
        needsFlights: false,
        adults: 2,
        vibeTags: ['foodie'],
        pace: 'moderate',
        interestsFreeform: `A balanced ${duration}-day ${dest.city} trip for travelers who like food and walkable neighborhoods.`,
        rawUserMessage: `${duration} days in ${dest.city}`,
      }),
      title: `${duration} days in ${dest.city}: a sample itinerary`,
      lede: `This is one good way to spend ${duration} days in ${dest.city}, built for travelers who like food, walkable neighborhoods, and a moderate pace. Adapt it to your trip with the planner at the bottom of the page.`,
    }
  }

  const niche = NICHES[slug]
  if (niche) {
    return {
      request: TripRequestSchema.parse({
        destinationRaw: dest.city,
        durationDays: 4,
        flexibleDates: true,
        needsFlights: false,
        adults: niche.relationship === 'solo' ? 1 : 2,
        relationship: niche.relationship,
        children: (niche.childAges ?? []).map((age) => ({ age })),
        vibeTags: niche.vibeTags,
        pace: niche.relationship === 'family' ? 'slow' : 'moderate',
        interestsFreeform: niche.freeform,
        rawUserMessage: `${dest.city} ${niche.label}`,
      }),
      title: `${dest.city} ${niche.label}: a sample itinerary`,
      lede: `A sample 4-day ${dest.city} itinerary ${niche.label}. Use it as a starting point — the planner builds one specific to your dates, budget, and pace.`,
    }
  }

  return null
}

export const allCitySlugs = destinations.map((d) => d.slug)
export const nicheSlugs = Object.keys(NICHES)
