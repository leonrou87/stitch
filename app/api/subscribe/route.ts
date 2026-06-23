import { NextRequest } from 'next/server'
import { getSupabase } from '@/lib/db/supabase'
import { sendEmail } from '@/lib/email/send'

export const runtime = 'nodejs'

// Newsletter signup: store the email (dedup) and send an optional welcome via Resend.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body?.source === 'string' ? body.source.slice(0, 40) : 'site'
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email.' }, { status: 400 })
  }

  const sb = getSupabase()
  if (sb) {
    // upsert so re-subscribing is a no-op, not an error
    await sb.from('subscribers').upsert({ email, source }, { onConflict: 'email' })
  }

  // Optional welcome (no-ops without RESEND_API_KEY)
  await sendEmail({
    to: email,
    subject: 'Welcome to Stitch',
    text: 'Thanks for subscribing. We send the occasional trip idea and new city — nothing more.\n\nPlan a trip anytime at https://stitch.kytepush.com',
  })

  return Response.json({ ok: true })
}
