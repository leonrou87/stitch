export function viatorSearchUrl(params: { query: string; city: string }): string {
  const url = new URL('https://www.viator.com/searchResults/all')
  url.searchParams.set('text', `${params.query} ${params.city}`)
  const pid = process.env.VIATOR_PARTNER_ID
  if (pid) url.searchParams.set('pid', pid)
  return url.toString()
}
