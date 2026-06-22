'use client'

import { useState } from 'react'

// "Email me this trip" — sends the itinerary link to an address via the server (Resend).
// If email isn't configured yet, it falls back to opening the user's own mail client.
export function EmailTrip({ slug, title }: { slug: string; title: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [msg, setMsg] = useState<string | null>(null)

  function mailtoFallback() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const subject = encodeURIComponent(`Your trip: ${title}`)
    const body = encodeURIComponent(`${title}\n${url}\n\nPlanned on Stitch.`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('sending'); setMsg(null)
    try {
      const res = await fetch('/api/email-trip', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.ok) { setState('sent'); return }
      if (data.configured === false) { mailtoFallback(); setState('sent'); setMsg('Opening your mail app.'); return }
      setState('error'); setMsg(data.error || "Couldn't send. Try again.")
    } catch { setState('error'); setMsg('Connection dropped. Try again.') }
  }

  if (state === 'sent') {
    return <p className="text-sm text-moss-600">Sent. {msg ?? 'Check your inbox.'}</p>
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
        className="flex-1 rounded-full border border-paper-edge bg-paper-card px-4 py-2 text-sm outline-none focus:border-clay-400"
      />
      <button type="submit" disabled={state === 'sending'} className="btn-ghost text-sm disabled:opacity-50">
        {state === 'sending' ? 'Sending…' : 'Email it to me'}
      </button>
      {state === 'error' && msg && <span className="text-sm text-clay-600">{msg}</span>}
    </form>
  )
}
