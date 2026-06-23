import Link from 'next/link'
import { destinations, destinationBySlug } from '@/lib/data/destinations'
import { CoverImage } from '@/components/ui/CoverImage'
import { BundleCard } from '@/components/build/BundleCard'
import { bundleById, bundles } from '@/lib/data/bundles'
import { catalogCitySlugs } from '@/lib/data/catalog'

const FEATURED = ['tokyo', 'lisbon', 'barcelona', 'mexico-city', 'paris', 'new-york-city']
const FEATURED_BUNDLES = ['tokyo-foodie', 'lisbon-slow', 'paris-first']
const QUICK_CITIES = ['tokyo', 'paris', 'rome', 'lisbon', 'barcelona', 'new-york-city', 'london', 'istanbul']

const STEPS: [string, string][] = [
  ['Pick or build', 'Start from a curated trip, or assemble your own from a catalog of real, named places — no blank page.'],
  ['Get the itinerary', 'A day-by-day plan, clustered by neighborhood and paced so you can actually enjoy it.'],
  ['Book and tick off', 'Every stay and reservation links straight to a partner. Book it, check it off, move on.'],
]

const FAQ: [string, string][] = [
  ['Is it free?', 'Yes. No signup needed to plan, no paywall.'],
  ['How do you make money?', 'A small commission when you book through our links. It never changes what you pay.'],
  ['Are the places real?', 'Every one is a real, named place. When we are not sure something is current, we say so.'],
  ['Can I change a trip?', 'Yes — adjust the days, pace, and stops right on the itinerary, and it re-plans in place.'],
]

export default function HomePage() {
  const featured = FEATURED.map((s) => destinations.find((d) => d.slug === s)!).filter(Boolean)
  const featuredBundles = FEATURED_BUNDLES.map((id) => bundleById(id)!).filter(Boolean)
  const quick = QUICK_CITIES.map((s) => destinationBySlug(s)!).filter(Boolean)
  const cityCount = catalogCitySlugs.length
  const tripCount = bundles.length

  return (
    <>
      {/* Hero — full-bleed image with overlay */}
      <section className="relative -mt-px flex min-h-[82vh] items-center overflow-hidden">
        <CoverImage imageKey="city:tokyo" query="tokyo skyline dusk" alt="" priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink/75" />
        <div className="container-wide relative py-20 text-paper">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-paper/80">Plan less. Travel more.</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.02] text-white sm:text-7xl">
              A trip you can book in an afternoon.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-paper/90">
              Start from a curated trip or build your own from real, named places. You get a clean
              day-by-day itinerary you book from one page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/trips" className="btn-clay px-7 py-3 text-base">Browse curated trips</Link>
              <Link href="/build" className="btn px-7 py-3 text-base border border-paper/40 bg-paper/10 text-paper backdrop-blur hover:bg-paper/20">
                Build your own
              </Link>
            </div>
            <p className="mt-6 text-sm text-paper/70">{cityCount} cities · {tripCount} curated trips · free, no signup</p>
          </div>
        </div>
      </section>

      {/* City quick-links */}
      <section className="border-b border-paper-edge bg-paper-card/60">
        <div className="container-wide flex flex-wrap items-center gap-2 py-5">
          <span className="mr-1 text-sm text-ink-mute">Jump in:</span>
          {quick.map((d) => (
            <Link key={d.slug} href={`/build/${d.slug}`} className="chip hover:border-clay-400 hover:text-ink">{d.city}</Link>
          ))}
          <Link href="/guide" className="chip hover:border-clay-400 hover:text-ink">All destinations →</Link>
        </div>
      </section>

      {/* Curated trips — the easy path, led first */}
      <section className="container-wide py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">Start with a curated trip</h2>
            <p className="mt-2 max-w-prose text-ink-soft">Themed and ready. Use one as-is, or edit the picks and dates first.</p>
          </div>
          <Link href="/trips" className="shrink-0 text-sm text-clay-600 hover:underline">All trips</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-paper-card/60 py-16">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl sm:text-4xl">How it works</h2>
            <p className="mt-2 text-ink-soft">Three steps from idea to a booked trip.</p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <div key={i} className="card p-6">
                <span className="font-serif text-4xl text-clay-400">{i + 1}</span>
                <h3 className="mt-3 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Or start from a city */}
      <section className="container-wide py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">Or start from a city</h2>
            <p className="mt-2 max-w-prose text-ink-soft">Build from scratch. Pick the places you want, we stitch the days.</p>
          </div>
          <Link href="/guide" className="shrink-0 text-sm text-clay-600 hover:underline">All destinations</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <Link key={d.slug} href={`/build/${d.slug}`} className="card group overflow-hidden">
              <div className="relative h-48 w-full overflow-hidden">
                <CoverImage imageKey={`city:${d.slug}`} query={d.heroImageQuery} alt={d.city} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl">{d.city}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{d.overviewMarkdown.split('. ')[0]}.</p>
                <span className="mt-3 inline-block text-sm text-clay-600">Build a {d.city} trip</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Stitch — editorial band */}
      <section className="bg-ink py-20 text-paper">
        <div className="container-wide max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay-400">Why Stitch</p>
          <p className="mt-5 font-serif text-2xl leading-relaxed sm:text-3xl">
            Most planners hand you a blank box or a wall of links. Stitch gives you real places worth
            your time, arranged into days that actually flow — then gets out of the way so you can book.
          </p>
          <Link href="/trips" className="btn-clay mt-8 px-7 py-3 text-base">See a curated trip</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-wide py-16">
        <div className="mx-auto max-w-prose">
          <h2 className="font-serif text-3xl sm:text-4xl">Good to know</h2>
          <div className="mt-6 divide-y divide-paper-edge">
            {FAQ.map(([q, a]) => (
              <div key={q} className="py-4">
                <h3 className="font-medium">{q}</h3>
                <p className="mt-1 text-ink-soft">{a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-mute">
            More questions? <Link href="/help" className="text-clay-600 hover:underline">Help</Link> ·{' '}
            <Link href="/contact" className="text-clay-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </section>
    </>
  )
}
