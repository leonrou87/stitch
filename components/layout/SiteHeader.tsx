import Link from 'next/link'
import { MyTripsNav } from '@/components/layout/MyTripsNav'

// One primary path: browse curated trips. Building your own is the quiet secondary.
// Everything else lives on the landing page and in the footer to keep the nav calm.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-edge/70 bg-paper/80 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full transition-opacity duration-200 hover:opacity-80"
        >
          <span aria-hidden className="text-xl text-clay-500">✦</span>
          <span className="font-serif text-xl tracking-tight">Stitch</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <span className="hidden sm:inline"><MyTripsNav /></span>
          <Link
            href="/build"
            className="hidden text-ink-soft transition-colors duration-200 hover:text-clay-700 sm:inline"
          >
            Build your own
          </Link>
          <Link href="/trips" className="btn-clay">Browse trips</Link>
        </nav>
      </div>
    </header>
  )
}
