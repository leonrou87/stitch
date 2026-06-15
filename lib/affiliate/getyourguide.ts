export function getyourguideSearchUrl(params: { query: string; city: string }): string {
  const url = new URL('https://www.getyourguide.com/s/')
  url.searchParams.set('q', `${params.query} ${params.city}`)
  const pid = process.env.GYG_PARTNER_ID
  if (pid) url.searchParams.set('partner_id', pid)
  return url.toString()
}
