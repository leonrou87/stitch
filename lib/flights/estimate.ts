// Flight lookup behind a provider interface. v1 ships a deterministic estimator (great-
// circle distance -> duration + price heuristic) plus live affiliate booking links, so it
// works with no API key. Drop a real provider (Aviasales/Kiwi via TravelPayouts) into
// LIVE_PROVIDER later — the rest of the app calls getFlightOptions and doesn't change.
import type { FlightOption } from '@/lib/types/itinerary'
import { findAirport, CITY_AIRPORT, type Airport } from './airports'
import { kiwiFlightSearchUrl } from '@/lib/affiliate/kiwi'
import { bookingFlightSearchUrl } from '@/lib/affiliate/booking'

export interface FlightQuery {
  origin: string // IATA or city
  destinationCitySlug: string
  departDate?: string
  returnDate?: string
  adults: number
}

export interface FlightProvider {
  name: string
  search(q: FlightQuery): Promise<FlightOption[]>
}

function haversineKm(a: Airport, b: Airport): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Crude but honest: cruise ~820 km/h + ~1.5h ground/taxi/climb overhead.
function estDurationHours(km: number): number {
  return Math.round((km / 820 + 1.5) * 10) / 10
}

// Round-trip economy estimate. Distance-banded $/km that tapers on long hauls.
function estPriceUsd(km: number, adults: number): number {
  const rate = km < 1500 ? 0.14 : km < 5000 ? 0.10 : 0.075
  const base = 60 + km * rate
  const roundTrip = base * 1.9
  return Math.round((roundTrip * adults) / 10) * 10
}

export const EstimatorProvider: FlightProvider = {
  name: 'estimate',
  async search(q: FlightQuery): Promise<FlightOption[]> {
    const from = findAirport(q.origin)
    const destCode = CITY_AIRPORT[q.destinationCitySlug]
    const to = destCode ? findAirport(destCode) : undefined
    if (!from || !to || from.code === to.code) return []

    const km = haversineKm(from, to)
    const hours = estDurationHours(km)
    const price = estPriceUsd(km, q.adults)
    const depart = q.departDate ?? ''

    const links = [
      {
        provider: 'Kiwi.com',
        url: kiwiFlightSearchUrl({ origin: from.code, destination: to.code, departDate: depart, returnDate: q.returnDate, adults: q.adults }),
        label: 'Compare on Kiwi.com',
        kind: 'flight' as const,
      },
      {
        provider: 'Booking.com Flights',
        url: bookingFlightSearchUrl({ origin: from.code, destination: to.code, departDate: depart, returnDate: q.returnDate, adults: q.adults }),
        label: 'Check Booking.com',
        kind: 'flight' as const,
      },
    ]

    return [
      {
        optionLabel: km < 1200 ? 'Short hop' : km < 5000 ? 'Best value' : 'Long haul',
        outbound: {
          from: from.code, to: to.code, depart: depart || new Date().toISOString(),
          carrier: 'Multiple carriers', durationHours: hours, stops: km > 9000 ? 1 : 0, cabinClass: 'economy',
        },
        estimatedPriceUsd: price,
        rationale: `Estimated from ${from.city} (${from.code}) to ${to.city} (${to.code}) — about ${Math.round(km).toLocaleString()} km. Prices are an estimate; tap through for live fares.`,
        affiliateLinks: links,
      },
    ]
  },
}

// Seam for the real API. Wire when a TravelPayouts token lands, then prefer it here.
const LIVE_PROVIDER: FlightProvider | null = null

export async function getFlightOptions(q: FlightQuery): Promise<FlightOption[]> {
  const provider = LIVE_PROVIDER ?? EstimatorProvider
  return provider.search(q)
}
