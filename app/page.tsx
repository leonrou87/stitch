import Link from 'next/link'
import { HomeHero } from '@/components/planner/HomeHero'
import { destinations } from '@/lib/data/destinations'
import { CoverImage } from '@/components/ui/CoverImage'
import { BundleCard } from '@/components/build/BundleCard'
import { bundleById } from '@/lib/data/bundles'

const FEATURED = ['tokyo', 'lisbon', 'barcelona', 'mexico-city', 'paris', 'new-york-city']
const FEATURED_BUNDLES = ['tokyo-foodie', 'lisbon-slow', 'paris-first']

const STEPS: [string, string][] = [
  ['Pick or build', 'Start from a curated trip, or assemble your own from a catalog of real, named places.'],
  ['Get the itinerary', 'A day-by-day plan, clustered by neighborhood and paced so you can actually enjoy it.'],
  ['Book and tick off', 'Every stay and reservation links to a partner. Book it, check it off, move on.'],
]

const FAQ: [string, string][] = [
  ['Is it free?', 'Yes. No signup, no paywall.'],
  ['How do you make money?', 'A small commission when you book through our links. It does not change what you pay.'],
  ['Are the places real?', 'Every one is a real, named place. When we are not sure something is current, we say so.'],
]

export default function HomePage() {
  const featured = FEATURED.map((s) => destinations.find((d) => d.slug === s)!).filter(Boolean)
  const featuredBundles = FEATURED_BUNDLES.map((id) => bundleById(id)!).filter(Boolean)

  return (
    <>
      {/* Hero */}
      <section className="container-wide pb-12 pt-20 sm:pt-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
            A trip you can book in an afternoon.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Start from a curated trip, get a day-by-day itinerary, and book it from one page.
            Real, named places. Free, no signup.
          </p>
        </div>
        <HomeHero />
      </section>

      {/* Curated trips — the easy path, led first */}
      <section className="container-wide py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">Start with a curated trip</h2>
            <p className="mt-2 max-w-prose text-ink-soft">
              Themed and ready. Use one as-is, or edit the picks first.
            </p>
          </div>
          <Link href="/trips" className="shrink-0 text-sm text-clay-600 hover:underline">
            All trips
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="container-wide py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl">How it works</h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <div key={i}>
              <span className="font-serif text-4xl text-clay-400">{i + 1}</span>
              <h3 className="mt-3 text-lg">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Or start from a city */}
      <section className="container-wide py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl">Or start from a city</h2>
            <p className="mt-2 max-w-prose text-ink-soft">
              Build from scratch. Pick the places you want, we stitch the days.
            </p>
          </div>
          <Link href="/guide" className="shrink-0 text-sm text-clay-600 hover:underline">
            All destinations
          </Link>
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

      {/* FAQ */}
      <section className="container-wide py-14">
        <div className="mx-auto max-w-prose">
          <h2 className="font-serif text-3xl">Good to know</h2>
          <div className="mt-6 divide-y divide-paper-edge">
            {FAQ.map(([q, a]) => (
              <div key={q} className="py-4">
                <h3 className="font-medium">{q}</h3>
                <p className="mt-1 text-ink-soft">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
