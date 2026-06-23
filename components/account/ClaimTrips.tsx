'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getTrips } from '@/lib/trips/local'

// When a user signs in, attach the trips they built on this device (still unowned) to their
// account — once per session. Renders nothing. Only mounted when Clerk is enabled.
export function ClaimTrips() {
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (!isSignedIn) return
    const flag = 'stitch:claimed'
    if (sessionStorage.getItem(flag)) return
    const slugs = getTrips().map((t) => t.slug)
    if (!slugs.length) { sessionStorage.setItem(flag, '1'); return }
    fetch('/api/me/claim', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs }),
    }).catch(() => {}).finally(() => sessionStorage.setItem(flag, '1'))
  }, [isSignedIn])

  return null
}
