import { NextRequest } from 'next/server'
import { getItineraryBySlug } from '@/lib/db/store'
import { sendEmail, emailConfigured } from '@/lib/email/send'

export const runtime = 'nodejs'

// Emails a saved itinerary's link + summary to the address provided. Returns
// { ok:false, configured:false } when Resend isn't set up so the UI can fall back to mailto.
export async function POST(request: NextRequest) {
  if (!emailConfigured()) {
    return Response.json({ ok: false, configured: false })
  }

  const body = await request.json().catch(() => ({}))
  const slug = typeof body?.slug === 'string' ? body.slug : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!slug || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ ok: false, configured: true, error: 'Enter a valid email.' }, { status: 400 })
  }

  const rec = await getItineraryBySlug(slug)
  if (!rec) return Response.json({ ok: false, configured: true, error: 'Trip not found.' }, { status: 404 })

  const it = rec.data
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stitch.kytepush.com'
  const url = `${appUrl}/i/${slug}`
  const title = `${it.dates.durationDays} days in ${it.destination.primaryCity}`

  const res = await sendEmail({
    to: email,
    subject: `Your trip: ${title}`,
    text: `${title}\n\n${it.summary}\n\nOpen and book it here:\n${url}\n\nPlanned on Stitch.`,
    html: `<p style="font-family:Georgia,serif;font-size:20px;margin:0 0 8px">${title}</p>
<p style="font-family:system-ui;color:#3a3a34">${escapeHtml(it.summary)}</p>
<p><a href="${url}" style="display:inline-block;background:#c66f3e;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-family:system-ui">Open your trip</a></p>
<p style="font-family:system-ui;color:#6b6a60;font-size:13px">${url}</p>`,
  })

  return Response.json(res)
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}
