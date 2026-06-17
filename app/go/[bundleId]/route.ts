import { NextRequest } from 'next/server'
import { bundleById } from '@/lib/data/bundles'
import { placesForCity } from '@/lib/data/catalog'
import { stitchItinerary } from '@/lib/plan/stitch'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'
import { saveItinerary } from '@/lib/db/store'
import { generateSlug } from '@/lib/seo/slug'
import { TripRequestSchema } from '@/lib/types/request'

export const runtime = 'nodejs'

// One-tap curated trip: stitch + save + redirect, entirely server-side. Replaces the old
// fragile client auto-save (navigate → effect → preview → POST → push), which silently
// dropped saves. A plain link to /go/<bundleId> now reliably lands the traveler on a saved
// /i/[slug] every time.
export async function GET(request: NextRequest, { params }: { params: Promise<{ bundleId: string }> }) {
  const { bundleId } = await params
  const bundle = bundleById(bundleId)
  if (!bundle) return new Response('Unknown trip', { status: 404 })

  const byId = new Map(placesForCity(bundle.citySlug).map((p) => [p.id, p]))
  const places = bundle.placeIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  if (!places.length) return new Response('Trip has no places', { status: 422 })

  let itinerary = stitchItinerary(bundle.citySlug, places, {
    durationDays: bundle.durationDays,
    pace: bundle.pace,
  })

  const req = TripRequestSchema.parse({
    destinationRaw: itinerary.destination.primaryCity,
    durationDays: itinerary.dates.durationDays,
    adults: itinerary.travelers.adults,
    vibeTags: itinerary.preferences.vibeTags,
    rawUserMessage: bundle.title,
  })
  itinerary = await attachAffiliateLinks(itinerary, req)

  const slug = generateSlug(itinerary)
  const saved = await saveItinerary({ slug, data: itinerary })

  return Response.redirect(new URL(`/i/${saved.slug}`, request.url), 303)
}
