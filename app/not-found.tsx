import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-prose py-24 text-center">
      <p className="font-serif text-6xl text-clay-400">✦</p>
      <h1 className="mt-4 font-serif text-3xl">We couldn&apos;t find that page.</h1>
      <p className="mt-3 text-ink-soft">
        The link may be wrong, or the trip may have moved on. Here is where most people go next.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/trips" className="btn-clay">Browse trips</Link>
        <Link href="/build" className="btn-ghost">Build</Link>
      </div>
    </div>
  )
}
