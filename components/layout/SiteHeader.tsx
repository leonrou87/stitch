import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-edge/70 bg-paper/80 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="text-clay-500 text-xl">✦</span>
          <span className="font-serif text-xl tracking-tight">Stitch</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft sm:flex">
          <Link href="/trips" className="hover:text-clay-600">Curated trips</Link>
          <Link href="/guide" className="hover:text-clay-600">Destinations</Link>
          <Link href="/about" className="hover:text-clay-600">How it works</Link>
          <Link href="/build" className="btn-clay">Build a trip</Link>
        </nav>
        <Link href="/build" className="btn-clay sm:hidden">Build a trip</Link>
      </div>
    </header>
  )
}
