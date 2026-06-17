import Link from 'next/link'

const explore = [
  ['Curated trips', '/trips'],
  ['Destinations', '/guide'],
  ['How it works', '/about'],
  ['Build a trip', '/build'],
] as const

const legal = [
  ['Affiliate disclosure', '/affiliate-disclosure'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
] as const

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-paper-edge bg-paper-card/60">
      <div className="container-wide flex flex-col gap-10 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-lg text-clay-500">✦</span>
            <span className="font-serif text-lg">Stitch</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            Plan a trip that&apos;s actually yours.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {explore.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-ink-soft transition-colors duration-200 hover:text-clay-700"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="container-wide flex flex-col gap-3 border-t border-paper-edge py-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Stitch. Affiliate-supported, never paid placement.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {legal.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="transition-colors duration-200 hover:text-clay-700"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
