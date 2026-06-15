const marker = () => process.env.TRAVELPAYOUTS_MARKER

export function kiwiFlightSearchUrl(params: {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  adults: number
}): string {
  const url = new URL('https://www.kiwi.com/deep')
  url.searchParams.set('from', params.origin)
  url.searchParams.set('to', params.destination)
  url.searchParams.set('departure', params.departDate)
  if (params.returnDate) url.searchParams.set('return', params.returnDate)
  url.searchParams.set('passengers', String(params.adults))
  const m = marker()
  if (m) url.searchParams.set('affilid', m)
  return url.toString()
}
