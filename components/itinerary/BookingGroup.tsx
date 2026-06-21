'use client'

import { useEffect, useState } from 'react'

export interface WrappedLink { provider: string; label: string; href: string }

// A booking cluster on the itinerary: links out to each partner, plus a tickable "Booked"
// state the traveler controls. We can't know if they actually purchased, so this is theirs
// to set and undo. Persisted in localStorage per itinerary so it survives a refresh.
function storageKey(slug: string) {
  return `stitch:booked:${slug}`
}

function readBooked(slug: string): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(storageKey(slug)) || '[]'))
  } catch {
    return new Set()
  }
}

export function BookingGroup({
  itemKey,
  slug,
  links,
  label = 'Book this',
  compact = false,
}: {
  itemKey: string
  slug: string
  links: WrappedLink[]
  label?: string
  compact?: boolean
}) {
  const [booked, setBooked] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setBooked(readBooked(slug).has(itemKey))
    // Keep this cluster in sync if the same item is toggled elsewhere on the page.
    function sync() {
      setBooked(readBooked(slug).has(itemKey))
    }
    window.addEventListener('stitch:booked-changed', sync)
    return () => window.removeEventListener('stitch:booked-changed', sync)
  }, [slug, itemKey])

  function toggle() {
    const set = readBooked(slug)
    if (set.has(itemKey)) set.delete(itemKey)
    else set.add(itemKey)
    localStorage.setItem(storageKey(slug), JSON.stringify([...set]))
    setBooked(set.has(itemKey))
    window.dispatchEvent(new CustomEvent('stitch:booked-changed'))
  }

  if (!links.length) return null

  const tick = (
    <button
      onClick={toggle}
      aria-pressed={booked}
      aria-label={booked ? 'Mark as not booked' : 'Mark as booked'}
      className={`btn px-3.5 py-2 text-sm ${
        booked
          ? 'bg-moss-500 text-white hover:bg-moss-600'
          : 'border border-paper-edge bg-paper-card text-ink-soft hover:border-moss-500 hover:text-moss-600'
      }`}
    >
      {!mounted ? (
        'Mark booked'
      ) : booked ? (
        <><CheckIcon /> Booked <span className="opacity-75">· undo</span></>
      ) : (
        <><CircleIcon /> Mark booked</>
      )}
    </button>
  )

  const linkButtons = links.map((l, i) => (
    <a
      key={i}
      href={l.href}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={`${i === 0 && !booked ? 'btn-clay' : 'btn-ghost'} ${booked ? 'opacity-70' : ''}`}
    >
      {l.label}
    </a>
  ))

  // Compact: a quiet inline row under an activity, restaurant, flight, or stay option.
  if (compact) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {linkButtons}
        {tick}
      </div>
    )
  }

  // Full: a framed booking panel for the pre-trip "sort before you go" cluster.
  return (
    <div
      className={`mt-4 rounded-xl border p-4 transition-colors ${
        booked ? 'border-moss-500/40 bg-moss-500/5' : 'border-paper-edge bg-paper'
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`mr-1 text-sm font-medium ${booked ? 'text-moss-600' : 'text-ink-soft'}`}>
          {booked ? 'Booked' : label}
        </span>
        {linkButtons}
        {tick}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
