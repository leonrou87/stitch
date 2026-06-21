'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { recordTrip } from '@/lib/trips/local'

// Drop this on the itinerary page. On view it adds the trip to the device's "My trips"
// list, and shows a quiet confirmation so the traveler knows it's kept and where to find it.
export function RecordTrip({ slug, title, city, days }: { slug: string; title: string; city: string; days: number }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    recordTrip({ slug, title, city, days })
    setSaved(true)
  }, [slug, title, city, days])

  if (!saved) return null

  return (
    <p className="mt-3 flex items-center gap-1.5 text-sm text-moss-600">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M3 8.5l3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Saved to{' '}
      <Link href="/me/trips" className="font-medium underline underline-offset-2 hover:text-moss-500">
        your trips
      </Link>
      <span className="text-ink-mute">· bookmark this page to share it</span>
    </p>
  )
}
