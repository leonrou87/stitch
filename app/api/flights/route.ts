import { NextRequest } from 'next/server'
import { getFlightOptions } from '@/lib/flights/estimate'

export const runtime = 'nodejs'

// Flight lookup. v1 returns deterministic estimates + live booking links (no key needed).
// Swap LIVE_PROVIDER in lib/flights/estimate.ts for a real API later; this route is stable.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const origin = sp.get('origin') ?? ''
  const city = sp.get('city') ?? ''
  const adults = Math.max(1, parseInt(sp.get('adults') ?? '2', 10) || 2)
  const departDate = sp.get('depart') ?? undefined

  if (!origin || !city) {
    return Response.json({ error: 'origin and city are required' }, { status: 400 })
  }

  const options = await getFlightOptions({ origin, destinationCitySlug: city, adults, departDate: departDate ?? undefined })
  return Response.json({ options })
}
