import { NextRequest } from 'next/server'
import { ItinerarySchema } from '@/lib/types/itinerary'
import { TripRequestSchema } from '@/lib/types/request'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'
import { saveItinerary } from '@/lib/db/store'
import { generateSlug } from '@/lib/seo/slug'
import { currentUserId } from '@/lib/auth/clerk'

export const runtime = 'nodejs'

// Persist a stitched itinerary. The client builds it deterministically (no AI); the server
// validates it, attaches tracked affiliate links, and saves. Affiliate enrichment runs here
// so real partner IDs (server-only env) are used and the client stays free of secrets.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = ItinerarySchema.safeParse(body?.itinerary)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid itinerary', details: parsed.error.format() }, { status: 400 })
  }

  const it = parsed.data
  const req = TripRequestSchema.parse({
    destinationRaw: it.destination.primaryCity,
    durationDays: it.dates.durationDays,
    adults: it.travelers.adults,
    children: it.travelers.children,
    vibeTags: it.preferences.vibeTags,
    rawUserMessage: `Stitched ${it.destination.primaryCity} trip`,
  })

  const enriched = await attachAffiliateLinks(it, req)
  const slug = generateSlug(enriched)
  const ownerId = await currentUserId()
  const saved = await saveItinerary({ slug, data: enriched, ownerId })

  return Response.json({ slug: saved.slug, url: `/i/${saved.slug}` })
}
