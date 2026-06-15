import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-prose py-24 text-center">
      <p className="font-serif text-6xl text-clay-400">✦</p>
      <h1 className="mt-4 font-serif text-3xl">We couldn&apos;t find that page.</h1>
      <p className="mt-3 text-ink-soft">The link may be wrong, or the trip may have moved on.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-ghost">Home</Link>
        <Link href="/plan" className="btn-clay">Plan a trip</Link>
      </div>
    </div>
  )
}
