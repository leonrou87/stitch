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

  useEffect(() => {
    setBooked(readBooked(slug).has(itemKey))
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

  return (
    <div className={`${compact ? 'mt-3' : 'mt-4 rounded-xl bg-paper p-4'} ${booked ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        {!compact && <span className="mr-1 text-sm font-medium text-ink-soft">{label} →</span>}
        {links.map((l, i) => (
          <a key={i} href={l.href} target="_blank" rel="nofollow sponsored noopener" className={i === 0 && !booked ? 'btn-clay' : 'btn-ghost'}>
            {l.label}
          </a>
        ))}
        <button
          onClick={toggle}
          aria-pressed={booked}
          className={`btn px-3 py-2 text-sm ${booked ? 'bg-moss-500 text-white' : 'border border-paper-edge bg-paper-card text-ink-soft hover:border-moss-500'}`}
        >
          {booked ? '✓ Booked · undo' : 'Mark booked'}
        </button>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-mute">affiliate links</p>
    </div>
  )
}
