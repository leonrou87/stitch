'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container-prose py-24 text-center">
      <p className="font-serif text-6xl text-clay-400" aria-hidden>
        ✦
      </p>
      <h1 className="mt-4 font-serif text-3xl">Something went sideways on our end.</h1>
      <p className="mt-3 text-ink-soft">
        The page hit a snag while loading. It is usually temporary — give it another go, or head
        back home and start fresh.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={() => reset()} className="btn-clay">
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          Home
        </Link>
      </div>
    </div>
  )
}
