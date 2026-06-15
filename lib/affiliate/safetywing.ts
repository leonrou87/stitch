export function safetywingUrl(): string {
  const ref = process.env.SAFETYWING_AFFILIATE_ID
  const base = 'https://safetywing.com/nomad-insurance'
  return ref ? `${base}?referenceID=${ref}` : base
}
