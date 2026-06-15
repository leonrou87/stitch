'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// FTC-required affiliate disclosure. Sticky and dismissible; shown on every page with
// affiliate links. Dismissal is remembered for the session.
export function DisclosureBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(sessionStorage.getItem('wf-disclosed') !== '1')
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-paper-edge bg-paper-card/95 backdrop-blur">
      <div className="container-wide flex items-center gap-4 py-3 text-xs text-ink-soft">
        <p className="flex-1">
          Stitch earns commissions when you book through our links. It doesn&apos;t change your price.{' '}
          <Link href="/affiliate-disclosure" className="font-medium text-clay-600 underline underline-offset-2">
            More on our Affiliate Disclosure
          </Link>
          .
        </p>
        <button
          aria-label="Dismiss"
          onClick={() => { sessionStorage.setItem('wf-disclosed', '1'); setShow(false) }}
          className="rounded-full px-2 py-1 text-ink-mute hover:bg-paper hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
