'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getTrips, removeTrip, MYTRIPS_EVENT, type LocalTrip } from '@/lib/trips/local'

export function MyTripsList() {
  const [trips, setTrips] = useState<LocalTrip[] | null>(null)

  useEffect(() => {
    const load = () => setTrips(getTrips())
    load()
    window.addEventListener(MYTRIPS_EVENT, load)
    return () => window.removeEventListener(MYTRIPS_EVENT, load)
  }, [])

  if (trips === null) return null // avoid hydration flash

  if (trips.length === 0) {
    return (
      <div className="card mt-8 p-8 text-center">
        <p className="text-ink-soft">No trips yet. Every trip you build or open shows up here.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/trips" className="btn-clay">Browse curated trips</Link>
          <Link href="/build" className="btn-ghost">Build your own</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-3">
      {trips.map((t) => (
        <div key={t.slug} className="card flex items-center justify-between gap-4 p-4">
          <Link href={`/i/${t.slug}`} className="min-w-0 flex-1">
            <p className="truncate font-serif text-lg">{t.title}</p>
            <p className="text-sm text-ink-mute">{t.city} · {t.days} day{t.days === 1 ? '' : 's'}</p>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/i/${t.slug}`} className="btn-ghost text-sm">Open</Link>
            <button
              onClick={() => removeTrip(t.slug)}
              aria-label="Remove from your trips"
              className="rounded-full px-2 py-1 text-sm text-ink-mute hover:bg-paper hover:text-ink"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <p className="pt-2 text-xs text-ink-mute">
        Saved on this device. Each trip also lives at its own link you can share.
      </p>
    </div>
  )
}
