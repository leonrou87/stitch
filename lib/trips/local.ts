'use client'

// Per-device "My trips" index. Every trip is already persisted server-side (Supabase) at a
// shareable /i/[slug] URL — this is just the local list so a traveler can find the trips
// they built or opened on this device, no signup required. Keyed in localStorage.
export interface LocalTrip {
  slug: string
  title: string
  city: string
  days: number
  savedAt: string
}

const KEY = 'stitch:mytrips'
const MAX = 60
export const MYTRIPS_EVENT = 'stitch:mytrips-changed'

export function getTrips(): LocalTrip[] {
  if (typeof window === 'undefined') return []
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]') as LocalTrip[]
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function recordTrip(trip: Omit<LocalTrip, 'savedAt'>): void {
  if (typeof window === 'undefined' || !trip.slug) return
  const list = getTrips().filter((t) => t.slug !== trip.slug)
  list.unshift({ ...trip, savedAt: new Date().toISOString() })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)))
  window.dispatchEvent(new CustomEvent(MYTRIPS_EVENT))
}

export function removeTrip(slug: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(getTrips().filter((t) => t.slug !== slug)))
  window.dispatchEvent(new CustomEvent(MYTRIPS_EVENT))
}
