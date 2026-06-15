import type { Itinerary } from '@/lib/types/itinerary'

export function generateSlug(itinerary: Itinerary): string {
  const city = itinerary.destination.primaryCity.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const duration = `${itinerary.dates.durationDays}-day`
  const vibe = itinerary.preferences.vibeTags[0]?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? null
  const hash = Math.random().toString(36).slice(2, 7)

  return [city, duration, vibe, hash].filter(Boolean).join('-')
}

export function destinationSlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
