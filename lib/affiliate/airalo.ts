export function airaloDestinationUrl(params: { country: string }): string {
  const slug = params.country.toLowerCase().replace(/\s+/g, '-')
  const ref = process.env.AIRALO_AFFILIATE_ID
  const base = `https://www.airalo.com/${slug}-esim`
  return ref ? `${base}?ref=${ref}` : base
}
