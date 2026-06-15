// Tool implementations. v1 returns search-deep-link URLs without real-time inventory;
// that's fine and honest. Upgrade to live TravelPayouts data as approvals come in.
// Adapted from the codepack: get_destination_overview reads the in-code destination
// seed (lib/data/destinations) rather than a Postgres table, so it runs with no DB.
import { bookingHotelSearchUrl, bookingFlightSearchUrl } from '@/lib/affiliate/booking'
import { kiwiFlightSearchUrl } from '@/lib/affiliate/kiwi'
import { viatorSearchUrl } from '@/lib/affiliate/viator'
import { getyourguideSearchUrl } from '@/lib/affiliate/getyourguide'
import { opentableSearchUrl } from '@/lib/affiliate/opentable'
import { destinationByCity } from '@/lib/data/destinations'

type ToolResult = Record<string, unknown>

export async function executeToolCall(name: string, input: Record<string, unknown>): Promise<ToolResult> {
  switch (name) {
    case 'search_flights':
      return searchFlights(input as never)
    case 'search_hotels':
      return searchHotels(input as never)
    case 'search_activities':
      return searchActivities(input as never)
    case 'search_restaurants':
      return searchRestaurants(input as never)
    case 'search_transport':
      return searchTransport(input as never)
    case 'get_destination_overview':
      return getDestinationOverview(input as never)
    case 'get_weather_forecast':
      return getWeatherForecast(input as never)
    default:
      return { error: `Unknown tool: ${name}` }
  }
}

async function searchFlights(input: { origin: string; destination: string; departDate: string; returnDate?: string; adults: number }): Promise<ToolResult> {
  return {
    note: 'Search-deep-link mode. Use these URLs to send the user to real inventory.',
    options: [
      {
        provider: 'Kiwi.com',
        url: kiwiFlightSearchUrl({
          origin: input.origin,
          destination: input.destination,
          departDate: input.departDate,
          returnDate: input.returnDate,
          adults: input.adults,
        }),
      },
      {
        provider: 'Booking.com Flights',
        url: bookingFlightSearchUrl({
          origin: input.origin,
          destination: input.destination,
          departDate: input.departDate,
          returnDate: input.returnDate,
          adults: input.adults,
        }),
      },
    ],
  }
}

async function searchHotels(input: { destination: string; checkIn: string; checkOut: string; adults: number; children?: number }): Promise<ToolResult> {
  return {
    note: 'Search-deep-link mode. The model should recommend specific hotels from its knowledge; we provide search URLs for booking.',
    booking_url: bookingHotelSearchUrl({
      query: input.destination,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      adults: input.adults,
      children: input.children ?? 0,
    }),
  }
}

async function searchActivities(input: { destination: string; interests?: string[] }): Promise<ToolResult> {
  return {
    note: 'Search-deep-link mode.',
    viator_search: viatorSearchUrl({ query: (input.interests ?? []).join(' '), city: input.destination }),
    gyg_search: getyourguideSearchUrl({ query: (input.interests ?? []).join(' '), city: input.destination }),
  }
}

async function searchRestaurants(input: { destination: string }): Promise<ToolResult> {
  return {
    note: 'The model should recommend specific restaurants from its knowledge; OpenTable URLs are search-based.',
    opentable_search: opentableSearchUrl({ query: '', city: input.destination }),
  }
}

async function searchTransport(_input: { origin: string; destination: string }): Promise<ToolResult> {
  return { note: 'No transport API connected yet. Recommend based on knowledge.' }
}

async function getDestinationOverview(input: { city: string }): Promise<ToolResult> {
  const row = destinationByCity(input.city)
  if (!row) return { note: 'No cached overview for this destination. Use general knowledge.' }
  return {
    city: row.city,
    country: row.country,
    neighborhoods: row.topNeighborhoods,
    bestTimeToVisit: row.bestTimeToVisit,
    practical: row.practical,
    overviewMarkdown: row.overviewMarkdown,
  }
}

async function getWeatherForecast(input: { city: string; dates: string[] }): Promise<ToolResult> {
  const row = destinationByCity(input.city)
  return {
    note: 'No weather API connected yet. Use climate knowledge.',
    city: input.city,
    dates: input.dates,
    typicalBestMonths: row?.bestTimeToVisit.months ?? null,
    climateNotes: row?.bestTimeToVisit.notes ?? null,
  }
}
