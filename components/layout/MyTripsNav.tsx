'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getTrips, MYTRIPS_EVENT } from '@/lib/trips/local'

// Header island: shows a "My trips" link with a count once the traveler has any. Hidden
// when empty so the nav stays calm for first-time visitors.
export function MyTripsNav() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const load = () => setCount(getTrips().length)
    load()
    window.addEventListener(MYTRIPS_EVENT, load)
    return () => window.removeEventListener(MYTRIPS_EVENT, load)
  }, [])

  if (count === 0) return null

  return (
    <Link href="/me/trips" className="text-ink-soft transition-colors hover:text-clay-700">
      My trips <span className="text-ink-mute">({count})</span>
    </Link>
  )
}
