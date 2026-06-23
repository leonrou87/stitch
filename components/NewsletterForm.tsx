'use client'

import { useState } from 'react'

// Email capture for the newsletter. Posts to /api/subscribe (stores to Supabase, optional
// Resend welcome). Works whether or not email sending is configured.
export function NewsletterForm({ source = 'site', dark = false }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('sending'); setMsg(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok && d.ok) { setState('done'); return }
      setState('error'); setMsg(d.error || 'Try again.')
    } catch { setState('error'); setMsg('Connection dropped. Try again.') }
  }

  if (state === 'done') {
    return <p className={`text-sm ${dark ? 'text-paper/80' : 'text-moss-600'}`}>You’re on the list. We’ll be in touch.</p>
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
        aria-label="Email address"
        className={`flex-1 rounded-full border px-4 py-2 text-sm outline-none ${dark ? 'border-paper/30 bg-paper/10 text-paper placeholder:text-paper/50 focus:border-paper/60' : 'border-paper-edge bg-paper-card focus:border-clay-400'}`}
      />
      <button type="submit" disabled={state === 'sending'} className="btn-clay shrink-0 text-sm disabled:opacity-50">
        {state === 'sending' ? 'Joining…' : 'Subscribe'}
      </button>
      {state === 'error' && msg && <span className="text-sm text-clay-600">{msg}</span>}
    </form>
  )
}
