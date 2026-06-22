import { NextRequest } from 'next/server'
import { multiCityById, multiCityLegs } from '@/lib/data/multicity'
import { stitchMultiCity } from '@/lib/plan/multicity'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'
import { saveItinerary } from '@/lib/db/store'
import { generateSlug } from '@/lib/seo/slug'
import { TripRequestSchema } from '@/lib/types/request'

export const runtime = 'nodejs'

// One-tap multi-city trip: stitch both legs, save, redirect — all server-side (reliable).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trip = multiCityById(id)
  if (!trip) return new Response('Unknown trip', { status: 404 })

  const legs = multiCityLegs(trip)
  if (legs.length < 2) return new Response('Trip is misconfigured', { status: 422 })

  let itinerary = stitchMultiCity(legs, { pace: trip.pace })
  const req = TripRequestSchema.parse({
    destinationRaw: itinerary.destination.primaryCity,
    durationDays: itinerary.dates.durationDays,
    adults: itinerary.travelers.adults,
    vibeTags: itinerary.preferences.vibeTags,
    rawUserMessage: trip.title,
  })
  itinerary = await attachAffiliateLinks(itinerary, req)

  const slug = generateSlug(itinerary)
  const saved = await saveItinerary({ slug, data: itinerary })
  return Response.redirect(new URL(`/i/${saved.slug}`, request.url), 303)
}
