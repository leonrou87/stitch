export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function unsplashUrl(query: string, w = 1200, h = 800): string {
  // Keyless placeholder that actually loads (source.unsplash.com was discontinued).
  // Seeded so each place gets a stable image. Swap for the Unsplash API + caching in
  // production to get destination-accurate, attributed photos.
  const seed = encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

export function formatBudgetRange(totalUsd?: number, durationDays = 1): string | null {
  if (!totalUsd) return null
  const low = Math.round((totalUsd * 0.85) / 50) * 50
  const high = Math.round((totalUsd * 1.15) / 50) * 50
  return `$${low.toLocaleString()} – $${high.toLocaleString()}`
}

export function travelerLine(adults: number, children: { age: number }[]): string {
  const a = `${adults} adult${adults > 1 ? 's' : ''}`
  if (!children.length) return a
  const ages = children.map((c) => c.age).join(' and ')
  return `${a}, ${children.length} child${children.length > 1 ? 'ren' : ''} (age${children.length > 1 ? 's' : ''} ${ages})`
}

export function middot(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' · ')
}
