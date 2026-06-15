'use client'

import { useState } from 'react'

export function ItineraryActions() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked; ignore */
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={copy} className="btn-ghost">
        {copied ? 'Link copied' : 'Share'}
      </button>
      <button onClick={() => window.print()} className="btn-ghost">Print</button>
      <a href="/plan" className="btn-ghost" title="Sign-in and saved trips ship with Clerk auth (see README)">
        Save trip
      </a>
    </div>
  )
}
