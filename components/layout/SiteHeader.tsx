import Link from 'next/link'

const navLinks = [
  ['Curated trips', '/trips'],
  ['Destinations', '/guide'],
  ['How it works', '/about'],
] as const

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

        <nav className="hidden items-center gap-8 text-sm sm:flex">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-ink-soft transition-colors duration-200 hover:text-clay-700"
            >
              {label}
            </Link>
          ))}
          <Link href="/build" className="btn-clay">Build a trip</Link>
        </nav>

        <Link href="/build" className="btn-clay sm:hidden">Build a trip</Link>
      </div>
    </header>
  )
}
