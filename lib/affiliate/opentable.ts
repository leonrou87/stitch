export function opentableSearchUrl(params: { query: string; city: string }): string {
  const url = new URL('https://www.opentable.com/s')
  url.searchParams.set('term', `${params.query} ${params.city}`.trim())
  const ref = process.env.OPENTABLE_AFFILIATE_ID
  if (ref) url.searchParams.set('ref', ref)
  return url.toString()
}
