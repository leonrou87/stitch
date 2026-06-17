import Link from 'next/link'

// The single, focused entry action: one primary (start with a curated trip — the easy
// path), one quiet secondary (build from scratch). City shortcuts live further down the
// page so the hero stays uncluttered.
export function HomeHero() {
  return (
    <div className="mx-auto mt-9 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Link href="/trips" className="btn-clay w-full px-7 py-3 text-base sm:w-auto">
        Browse curated trips
      </Link>
      <Link href="/build" className="btn-ghost w-full px-7 py-3 text-base sm:w-auto">
        Build your own
      </Link>
    </div>
  )
}
