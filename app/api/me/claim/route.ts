import { NextRequest } from 'next/server'
import { currentUserId } from '@/lib/auth/clerk'
import { claimItineraries } from '@/lib/db/store'

export const runtime = 'nodejs'

// On sign-in, attach this device's saved (unowned) trips to the account.
export async function POST(request: NextRequest) {
  const userId = await currentUserId()
  if (!userId) return Response.json({ claimed: 0 })
  const body = await request.json().catch(() => ({}))
  const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s: unknown) => typeof s === 'string').slice(0, 200) : []
  const claimed = await claimItineraries(userId, slugs)
  return Response.json({ claimed })
}
