import Link from 'next/link'

const cols = [
  { head: 'Explore', links: [['Curated trips', '/trips'], ['Destinations', '/guide'], ['Build a trip', '/build']] },
  { head: 'Product', links: [['How it works', '/about'], ['Pricing', '/about'], ['Partners', '/affiliate-disclosure']] },
  { head: 'Company', links: [['About', '/about'], ['Privacy', '/privacy'], ['Terms', '/terms']] },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-paper-edge bg-paper-card/60">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-clay-500 text-lg">✦</span>
            <span className="font-serif text-lg">Stitch</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-mute">Plan a trip that&apos;s actually yours.</p>
        </div>
        {cols.map((c) => (
          <div key={c.head}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-mute">{c.head}</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {c.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-clay-600">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-wide flex flex-col gap-2 border-t border-paper-edge py-6 text-xs text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Stitch. Affiliate-supported, never paid placement.</p>
        <div className="flex gap-4">
          <Link href="/affiliate-disclosure" className="hover:text-clay-600">Affiliate disclosure</Link>
          <Link href="/privacy" className="hover:text-clay-600">Privacy</Link>
          <Link href="/terms" className="hover:text-clay-600">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
