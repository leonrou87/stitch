export function discoverCarsUrl(params: {
  pickupLocation: string
  pickupDate: string
  dropoffDate: string
}): string {
  const url = new URL('https://www.discovercars.com/')
  url.searchParams.set('pickup_location', params.pickupLocation)
  url.searchParams.set('pickup_date', params.pickupDate)
  url.searchParams.set('return_date', params.dropoffDate)
  const m = process.env.TRAVELPAYOUTS_MARKER
  if (m) url.searchParams.set('marker', m)
  return url.toString()
}
