// Email sending via Resend's REST API (no SDK dependency). Graceful: when RESEND_API_KEY
// is absent it no-ops and reports `configured: false`, so callers can fall back (e.g. to a
// mailto link) without errors. Set RESEND_API_KEY and RESEND_FROM (a verified-domain sender,
// e.g. "Stitch <hello@stitch.kytepush.com>") to turn it on; defaults to Resend's test sender.
export interface SendResult { ok: boolean; configured: boolean; error?: string }

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  replyTo?: string
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { ok: false, configured: false }

  const from = process.env.RESEND_FROM || 'Stitch <onboarding@resend.dev>'
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        reply_to: opts.replyTo || undefined,
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      return { ok: false, configured: true, error: detail.slice(0, 200) || `HTTP ${res.status}` }
    }
    return { ok: true, configured: true }
  } catch (e) {
    return { ok: false, configured: true, error: e instanceof Error ? e.message : 'send failed' }
  }
}
