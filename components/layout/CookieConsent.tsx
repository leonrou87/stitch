'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// One bottom banner covering both cookie consent and the FTC affiliate disclosure. Shown
// until the visitor chooses; the choice (accepted | declined) is stored and gates analytics.
export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(!localStorage.getItem('stitch:consent'))
  }, [])

  function choose(value: 'accepted' | 'declined') {
    localStorage.setItem('stitch:consent', value)
    window.dispatchEvent(new CustomEvent('stitch:consent-changed'))
    setShow(false)
  }

  if (!show) return null

  return (
    <div role="region" aria-label="Cookies and disclosure" className="fixed inset-x-0 bottom-0 z-50 border-t border-paper-edge bg-paper-card/95 backdrop-blur">
      <div className="container-wide flex flex-col gap-3 py-3.5 text-xs leading-relaxed text-ink-soft sm:flex-row sm:items-center">
        <p className="flex-1">
          Stitch uses essential cookies (to keep you signed in) and cookieless analytics. We earn
          affiliate commissions on bookings — it never changes your price; partner sites may set their
          own cookies.{' '}
          <Link href="/affiliate-disclosure" className="font-medium text-clay-600 underline underline-offset-2 hover:text-clay-700">Disclosure</Link>
          {' · '}
          <Link href="/privacy" className="font-medium text-clay-600 underline underline-offset-2 hover:text-clay-700">Privacy</Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose('declined')} className="btn-ghost px-4 py-1.5 text-sm">Decline analytics</button>
          <button type="button" onClick={() => choose('accepted')} className="btn-clay px-4 py-1.5 text-sm">Accept</button>
        </div>
      </div>
    </div>
  )
}
