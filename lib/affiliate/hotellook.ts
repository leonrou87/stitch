const marker = () => process.env.TRAVELPAYOUTS_MARKER

export function hotellookSearchUrl(params: {
  query: string
  city: string
  checkIn: string
  checkOut: string
  adults: number
}): string {
  const url = new URL('https://search.hotellook.com/')
  url.searchParams.set('destination', params.city)
  url.searchParams.set('checkIn', params.checkIn)
  url.searchParams.set('checkOut', params.checkOut)
  url.searchParams.set('adults', String(params.adults))
  const m = marker()
  if (m) url.searchParams.set('marker', m)
  return url.toString()
}
