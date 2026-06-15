import type { AffiliateLink } from '@/lib/types/itinerary'
import { wrapAffiliate } from '@/lib/db/store'
import { BookingGroup } from './BookingGroup'

// Server component: wraps each affiliate link through /r/[clickId] for tracking (one row
// per link), then hands the resolved hrefs to the client BookingGroup, which renders the
// buttons and the tickable "booked" checklist state. The FTC "(affiliate links)" note is
// shown by BookingGroup. itemKey is derived from the first wrapped link so a place's booked
// state is stable across renders.
export function AffiliateButtons({
  links,
  itineraryId,
  slug = 'sample',
  label = 'Book this',
  compact = false,
}: {
  links: AffiliateLink[]
  itineraryId: string | null
  slug?: string
  label?: string
  compact?: boolean
}) {
  if (!links?.length) return null

  const wrapped = links.map((link) => ({
    provider: link.provider,
    label: link.label,
    href: wrapAffiliate({ itineraryId, provider: link.provider, kind: link.kind, targetUrl: link.url }),
  }))

  return <BookingGroup itemKey={wrapped[0].href} slug={slug} links={wrapped} label={label} compact={compact} />
}
