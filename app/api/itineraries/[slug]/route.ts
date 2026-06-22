import { NextRequest } from 'next/server'
import { ItinerarySchema, type Itinerary } from '@/lib/types/itinerary'
import { TripRequestSchema } from '@/lib/types/request'
import { getItineraryBySlug, updateItinerary } from '@/lib/db/store'
import { placesForCity } from '@/lib/data/catalog'
import { stitchItinerary } from '@/lib/plan/stitch'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'

export const runtime = 'nodejs'

// In-place edit of a saved trip. Ops:
//   removeActivity { dayNumber, index }  — drop a stop (and any day it empties)
//   setDays { days }                     — re-stitch from source.placeIds at a new length
//   setPace { pace }                     — re-stitch from source.placeIds at a new pace
//   setPlaceIds { placeIds }             — re-stitch from a new set of picks (add/swap)
// Re-stitch ops require the trip to have `source` (new trips do; very old ones don't).
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const rec = await getItineraryBySlug(slug)
  if (!rec) return Response.json({ error: 'Not found' }, { status: 404 })
  const data = rec.data as Itinerary
  const body = await request.json().catch(() => ({}))

  if (body.op === 'removeActivity') {
    const day = data.days.find((d) => d.dayNumber === body.dayNumber)
    if (!day) return Response.json({ error: 'Bad day' }, { status: 400 })
    day.activities.splice(body.index, 1)
    // Drop emptied days and renumber.
    data.days = data.days.filter((d) => d.activities.length > 0).map((d, i) => ({ ...d, dayNumber: i + 1 }))
    if (data.days.length === 0) return Response.json({ error: 'A trip needs at least one stop' }, { status: 409 })
    data.dates.durationDays = data.days.length
    const parsed = ItinerarySchema.safeParse(data)
    if (!parsed.success) return Response.json({ error: 'Invalid result' }, { status: 422 })
    const saved = await updateItinerary(slug, parsed.data)
    return Response.json({ ok: true, url: `/i/${saved?.slug ?? slug}` })
  }

  if (body.op === 'setDays' || body.op === 'setPace' || body.op === 'setPlaceIds') {
    const source = data.source
    if (!source) return Response.json({ error: 'This trip predates in-place editing. Open it in the planner.' }, { status: 409 })
    const placeIds: string[] = body.op === 'setPlaceIds' && Array.isArray(body.placeIds) ? body.placeIds : source.placeIds
    const byId = new Map(placesForCity(source.citySlug).map((p) => [p.id, p]))
    const places = placeIds.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
    if (!places.length) return Response.json({ error: 'No valid places' }, { status: 400 })

    const days = body.op === 'setDays' ? clampInt(body.days, 1, 14) : data.dates.durationDays
    const pace = body.op === 'setPace' ? body.pace : (source.pace ?? data.preferences.pace)

    let next = stitchItinerary(source.citySlug, places, { durationDays: days, pace, startDate: data.dates.start })
    const req = TripRequestSchema.parse({
      destinationRaw: next.destination.primaryCity, durationDays: next.dates.durationDays,
      adults: next.travelers.adults, vibeTags: next.preferences.vibeTags, rawUserMessage: `Edit ${next.destination.primaryCity}`,
    })
    next = await attachAffiliateLinks(next, req)
    const saved = await updateItinerary(slug, next)
    return Response.json({ ok: true, url: `/i/${saved?.slug ?? slug}` })
  }

  return Response.json({ error: 'Unknown op' }, { status: 400 })
}

function clampInt(n: unknown, lo: number, hi: number): number {
  const v = Math.round(Number(n))
  return Number.isFinite(v) ? Math.max(lo, Math.min(hi, v)) : lo
}
