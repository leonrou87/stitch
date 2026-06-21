import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/db/supabase'

export const runtime = 'nodejs'

// Captures support and feedback messages. Persists to the Supabase `feedback` table when a
// client is configured; degrades gracefully to { ok: true } when it isn't (e.g. local dev,
// or env absent during build). Optionally forwards the message via Resend's REST API when
// RESEND_API_KEY is set — wrapped so a forwarding failure never breaks the response.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const kind = typeof body?.kind === 'string' && body.kind.trim() ? body.kind.trim() : 'contact'
  const tripSlug = typeof body?.trip_slug === 'string' ? body.trip_slug.trim() : ''

  if (!message) {
    return Response.json({ error: 'A message is required.' }, { status: 400 })
  }

  const userAgent = request.headers.get('user-agent') ?? ''

  const supabase = getSupabase()
  if (supabase) {
    await supabase.from('feedback').insert({
      kind,
      name: name || null,
      email: email || null,
      message,
      trip_slug: tripSlug || null,
      user_agent: userAgent || null,
    })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    try {
      const to = process.env.SUPPORT_FORWARD_EMAIL || 'leonrou87@gmail.com'
      const lines = [
        `Kind: ${kind}`,
        `Name: ${name || '—'}`,
        `Email: ${email || '—'}`,
        tripSlug ? `Trip: ${tripSlug}` : '',
        '',
        message,
      ]
        .filter((line) => line !== null)
        .join('\n')

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Stitch <onboarding@resend.dev>',
          to: [to],
          reply_to: email || undefined,
          subject: `Stitch ${kind} message${name ? ` from ${name}` : ''}`,
          text: lines,
        }),
      })
    } catch {
      // Forwarding is best-effort; the message is already captured above.
    }
  }

  return Response.json({ ok: true })
}
