import type { Itinerary } from '@/lib/types/itinerary'
import { bookingHotelSearchUrl, bookingFlightSearchUrl } from './booking'
import { kiwiFlightSearchUrl } from './kiwi'
import { hotellookSearchUrl } from './hotellook'
import { viatorSearchUrl } from './viator'
import { getyourguideSearchUrl } from './getyourguide'
import { opentableSearchUrl } from './opentable'
import { airaloDestinationUrl } from './airalo'
import { safetywingUrl } from './safetywing'
import type { TripRequest } from '@/lib/types/request'

export async function attachAffiliateLinks(
  itinerary: Itinerary,
  request: TripRequest,
): Promise<Itinerary> {
  const city = itinerary.destination.primaryCity
  const country = itinerary.destination.country

  if (itinerary.flights) {
    for (const flight of itinerary.flights) {
      flight.affiliateLinks = [
        ...flight.affiliateLinks,
        {
          provider: 'Kiwi.com',
          url: kiwiFlightSearchUrl({
            origin: flight.outbound.from,
            destination: flight.outbound.to,
            departDate: flight.outbound.depart.slice(0, 10),
            returnDate: flight.return?.depart.slice(0, 10),
            adults: request.adults,
          }),
          label: 'Compare on Kiwi.com',
          kind: 'flight',
        },
        {
          provider: 'Booking.com Flights',
          url: bookingFlightSearchUrl({
            origin: flight.outbound.from,
            destination: flight.outbound.to,
            departDate: flight.outbound.depart.slice(0, 10),
            returnDate: flight.return?.depart.slice(0, 10),
            adults: request.adults,
          }),
          label: 'Check Booking.com',
          kind: 'flight',
        },
      ]
    }
  }

  if (itinerary.stays) {
    for (const stay of itinerary.stays) {
      const { checkIn, checkOut } = resolveStayDates(stay, itinerary)
      for (const option of stay.options) {
        option.affiliateLinks = [
          ...option.affiliateLinks,
          {
            provider: 'Booking.com',
            url: bookingHotelSearchUrl({
              query: `${option.name} ${city}`,
              checkIn,
              checkOut,
              adults: request.adults,
              children: request.children.length,
            }),
            label: 'Book on Booking.com',
            kind: 'hotel',
          },
          {
            provider: 'Hotellook',
            url: hotellookSearchUrl({
              query: option.name,
              city,
              checkIn,
              checkOut,
              adults: request.adults,
            }),
            label: 'Compare prices on Hotellook',
            kind: 'hotel',
          },
        ]
      }
    }
  }

  for (const day of itinerary.days) {
    for (const activity of day.activities) {
      if (activity.type === 'restaurant' && activity.location?.name) {
        activity.affiliateLinks = [
          ...activity.affiliateLinks,
          {
            provider: 'OpenTable',
            url: opentableSearchUrl({
              query: activity.location.name,
              city,
            }),
            label: 'Check OpenTable',
            kind: 'restaurant',
          },
        ]
      }

      if (
        ['experience', 'class', 'sightseeing', 'outdoor', 'show'].includes(activity.type) &&
        activity.bookingRequired
      ) {
        activity.affiliateLinks = [
          ...activity.affiliateLinks,
          {
            provider: 'Viator',
            url: viatorSearchUrl({ query: activity.title, city }),
            label: 'Find on Viator',
            kind: 'activity',
          },
          {
            provider: 'GetYourGuide',
            url: getyourguideSearchUrl({ query: activity.title, city }),
            label: 'Find on GetYourGuide',
            kind: 'activity',
          },
        ]
      }
    }
  }

  if (!itinerary.preTrip) itinerary.preTrip = { insuranceRecommendations: [], esimRecommendations: [], packingTips: [], appsToInstall: [] }

  itinerary.preTrip.insuranceRecommendations = [
    {
      provider: 'SafetyWing',
      url: safetywingUrl(),
      label: 'Quote travel insurance',
      kind: 'insurance',
    },
  ]

  itinerary.preTrip.esimRecommendations = [
    {
      provider: 'Airalo',
      url: airaloDestinationUrl({ country }),
      label: `Get an eSIM for ${country}`,
      kind: 'esim',
    },
  ]

  return itinerary
}

function resolveStayDates(stay: { nightRange: string }, itinerary: Itinerary): {
  checkIn: string
  checkOut: string
} {
  if (itinerary.dates.start && itinerary.dates.end) {
    return { checkIn: itinerary.dates.start, checkOut: itinerary.dates.end }
  }
  const today = new Date()
  const checkIn = new Date(today)
  checkIn.setDate(today.getDate() + 30)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkIn.getDate() + itinerary.dates.durationDays)
  return {
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
  }
}
