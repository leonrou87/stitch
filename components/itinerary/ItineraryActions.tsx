'use client'

import { useEffect, useState } from 'react'

// Reads the same localStorage the BookingGroup writes, so the header progress count stays
// in sync. We only know how many items are booked, not the total bookable count, so the
// total is passed in from the server-rendered view.
function bookedCount(slug: string): number {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(`stitch:booked:${slug}`) || '[]')).size
  } catch {
    return 0
  }
}

export function ItineraryActions({
  slug,
  bookableTotal = 0,
}: {
  slug?: string
  bookableTotal?: number
} = {}) {
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!slug) return
    const key = slug
    setMounted(true)
    setCount(bookedCount(key))
    function sync() {
      setCount(bookedCount(key))
    }
    window.addEventListener('stitch:booked-changed', sync)
    return () => window.removeEventListener('stitch:booked-changed', sync)
  }, [slug])

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked; ignore */
    }
  }

  function emailTrip() {
    const title = (typeof document !== 'undefined' && document.title.split(' · ')[0]) || 'A trip'
    const url = window.location.href
    const subject = encodeURIComponent(`${title} — a trip I planned on Stitch`)
    const body = encodeURIComponent(`Take a look at this trip:\n\n${title}\n${url}\n\nBuilt on Stitch.`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  async function share() {
    // Native share sheet on mobile (lets you forward to anyone), copy-link fallback.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href })
        return
      } catch {
        /* cancelled; fall through to copy */
      }
    }
    void copy()
  }

  const showProgress = mounted && bookableTotal > 0
  const pct = showProgress ? Math.round((Math.min(count, bookableTotal) / bookableTotal) * 100) : 0
  const allDone = showProgress && count >= bookableTotal

  return (
    <div className="flex flex-col items-stretch gap-4 sm:items-end">
      {showProgress && (
        <div className="w-full sm:w-56">
          <div className="flex items-baseline justify-between text-sm">
            <span className={`font-medium ${allDone ? 'text-moss-600' : 'text-ink'}`}>
              {allDone ? 'All booked' : `${Math.min(count, bookableTotal)} of ${bookableTotal} booked`}
            </span>
            <span className="text-xs text-ink-mute">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-paper-edge">
            <div
              className="h-full rounded-full bg-moss-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button onClick={share} className="btn-ghost">
          {copied ? 'Link copied' : 'Share'}
        </button>
        <button onClick={emailTrip} className="btn-ghost">Email</button>
        <button onClick={() => window.print()} className="btn-ghost">Print</button>
      </div>
    </div>
  )
}
