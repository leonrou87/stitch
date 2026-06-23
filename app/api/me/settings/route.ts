import { NextRequest } from 'next/server'
import { currentUserId } from '@/lib/auth/clerk'
import { getUserPrefs, saveUserPrefs } from '@/lib/db/store'

export const runtime = 'nodejs'

export async function GET() {
  const userId = await currentUserId()
  if (!userId) return Response.json({ signedIn: false, prefs: null })
  return Response.json({ signedIn: true, prefs: await getUserPrefs(userId) })
}

export async function PATCH(request: NextRequest) {
  const userId = await currentUserId()
  if (!userId) return Response.json({ error: 'Sign in to save settings.' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const homeAirport = typeof body.homeAirport === 'string' ? body.homeAirport.trim().toUpperCase().slice(0, 4) || null : null
  const defaultPace = ['slow', 'moderate', 'packed'].includes(body.defaultPace) ? body.defaultPace : null
  const dietary = Array.isArray(body.dietary) ? body.dietary.filter((x: unknown) => typeof x === 'string').slice(0, 12) : []
  await saveUserPrefs(userId, { homeAirport, defaultPace, dietary })
  return Response.json({ ok: true })
}
