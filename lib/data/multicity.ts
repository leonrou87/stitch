// Multi-city trips: two nearby cities stitched into one itinerary. Each leg reuses an
// existing curated bundle's picks, so the data is always valid. Add pairs that are genuinely
// close by train/short flight.
import { bundleById } from './bundles'

export interface MultiCityTrip {
  id: string
  title: string
  theme: string
  tagline: string
  heroQuery: string
  pace: 'slow' | 'moderate' | 'packed'
  legBundleIds: string[] // each resolves to { citySlug, placeIds, durationDays }
}

export const multiCityTrips: MultiCityTrip[] = [
  {
    id: 'jp-tokyo-kyoto',
    title: 'Japan in a week: Tokyo & Kyoto',
    theme: 'Two cities',
    tagline: 'The neon and the temples. Tokyo first, then the shinkansen to Kyoto.',
    heroQuery: 'japan tokyo kyoto bullet train temple',
    pace: 'moderate',
    legBundleIds: ['tokyo-first', 'kyoto-first'],
  },
  {
    id: 'eu-paris-london',
    title: 'Paris & London by train',
    theme: 'Two cities',
    tagline: 'Two capitals, two and a half hours apart on the Eurostar.',
    heroQuery: 'paris london eurostar skyline',
    pace: 'moderate',
    legBundleIds: ['paris-first', 'london-first'],
  },
  {
    id: 'eu-amsterdam-paris',
    title: 'Amsterdam & Paris',
    theme: 'Two cities',
    tagline: 'Canals then boulevards — an easy train hop between them.',
    heroQuery: 'amsterdam canal paris boulevard',
    pace: 'moderate',
    legBundleIds: ['amsterdam-first', 'paris-first'],
  },
]

export const multiCityById = (id: string) => multiCityTrips.find((t) => t.id === id)

export function multiCityLegs(t: MultiCityTrip): { citySlug: string; placeIds: string[]; days: number }[] {
  return t.legBundleIds
    .map((bid) => bundleById(bid))
    .filter((b): b is NonNullable<typeof b> => Boolean(b))
    .map((b) => ({ citySlug: b.citySlug, placeIds: b.placeIds, days: b.durationDays }))
}

// Multi-city trips that include a given city (for "pair with a nearby city" suggestions).
export function multiCityForCity(citySlug: string): MultiCityTrip[] {
  return multiCityTrips.filter((t) => multiCityLegs(t).some((l) => l.citySlug === citySlug))
}
