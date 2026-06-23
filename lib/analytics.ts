// Privacy-friendly analytics via Plausible (cookieless). Off unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN
// is set. `track` fires a custom event if the script loaded; safe no-op otherwise.
export const analyticsDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
export const analyticsEnabled = Boolean(analyticsDomain)

export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return
  const p = (window as unknown as { plausible?: (e: string, o?: { props: Record<string, unknown> }) => void }).plausible
  if (p) p(event, props ? { props } : undefined)
}
