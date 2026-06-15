// Booking.com affiliate URL builders. Affiliate ID via Booking Partner Hub.
// Improvement over the codepack draft: when the affiliate ID is unset we omit the
// param entirely rather than emitting `aid=undefined`, so links work before approval.
const aid = () => process.env.BOOKING_AFFILIATE_ID

export function bookingHotelSearchUrl(params: {
  query: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms?: number
}): string {
  const url = new URL('https://www.booking.com/searchresults.html')
  const id = aid()
  if (id) url.searchParams.set('aid', id)
  url.searchParams.set('ss', params.query)
  url.searchParams.set('checkin', params.checkIn)
  url.searchParams.set('checkout', params.checkOut)
  url.searchParams.set('group_adults', String(params.adults))
  if (params.children > 0) url.searchParams.set('group_children', String(params.children))
  url.searchParams.set('no_rooms', String(params.rooms ?? 1))
  return url.toString()
}

export function bookingFlightSearchUrl(params: {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  adults: number
}): string {
  const url = new URL('https://flights.booking.com/flights/')
  const id = aid()
  if (id) url.searchParams.set('aid', id)
  url.searchParams.set('from', params.origin)
  url.searchParams.set('to', params.destination)
  url.searchParams.set('depart', params.departDate)
  if (params.returnDate) url.searchParams.set('return', params.returnDate)
  url.searchParams.set('adults', String(params.adults))
  return url.toString()
}
