'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!message.trim()) {
      setError('Add a message so we know what you need.')
      return
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setError('That email address looks off — check it over.')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          kind: 'contact',
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setError('Something went wrong sending that. Try again in a moment.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="card max-w-prose">
        <p className="font-serif text-xl text-ink">Thanks — we read everything and reply within a day or two.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-ghost mt-5"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-prose space-y-5">
      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-sm text-ink-soft">
          Name <span className="text-ink-mute">(optional)</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-paper-edge bg-paper px-3 py-2 text-ink outline-none transition-colors focus:border-clay-400"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-sm text-ink-soft">
          Email <span className="text-ink-mute">(optional, if you want a reply)</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-paper-edge bg-paper px-3 py-2 text-ink outline-none transition-colors focus:border-clay-400"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-sm text-ink-soft">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-lg border border-paper-edge bg-paper px-3 py-2 text-ink outline-none transition-colors focus:border-clay-400"
        />
      </div>

      {error ? (
        <p className="text-sm text-clay-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-clay" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <span className="text-sm text-ink-mute">We answer within a day or two.</span>
      </div>
    </form>
  )
}
