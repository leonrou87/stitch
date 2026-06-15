import Link from 'next/link'
import { HomeHero } from '@/components/planner/HomeHero'
import { destinations } from '@/lib/data/destinations'
import { CoverImage } from '@/components/ui/CoverImage'
import { BundleCard } from '@/components/build/BundleCard'
import { bundleById } from '@/lib/data/bundles'

const FEATURED = ['tokyo', 'lisbon', 'barcelona', 'mexico-city', 'paris', 'new-york-city']
const FEATURED_BUNDLES = ['tokyo-foodie', 'lisbon-slow', 'bcn-first', 'cdmx-food', 'paris-first', 'nyc-weekend']

const STEPS = [
  ['Start from a curated trip.', 'Short on time? Pick a themed, ready-made itinerary — “Tokyo, eaten well” or “Lisbon, slow” — and you have a full plan in one tap. Or build your own from the catalog.'],
  ['Tweak it to fit.', 'Swap places, change the pace, add days. We re-stitch on the fly — clustered by neighborhood, paced, meals in the right slots.'],
  ['Book it all from one page, and tick things off.', 'Your itinerary lists every flight, stay, and reservation with a link to the partner and a checkbox. Book it, check it off, move on.'],
]

export default function HomePage() {
  const featured = FEATURED.map((s) => destinations.find((d) => d.slug === s)!).filter(Boolean)
  const featuredBundles = FEATURED_BUNDLES.map((id) => bundleById(id)!).filter(Boolean)

  return (
    <>
      {/* Hero */}
      <section className="container-wide pb-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
            Plan a trip that&apos;s actually yours.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
            Pick a curated trip and go, or assemble your own from real, named places. Either way you
            get a day-by-day plan you book from one page. Free, no signup.
          </p>
        </div>
        <HomeHero />
      </section>

      {/* Curated trips */}
      <section className="container-wide py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Curated trips</h2>
          <Link href="/trips" className="text-sm text-clay-600 hover:underline">All curated trips →</Link>
        </div>
        <p className="mt-1 max-w-prose text-ink-soft">Themed and ready. Tap one for a finished itinerary, or tweak it first.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
        </div>
      </section>

      {/* Featured cities */}
      <section className="container-wide py-12">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">Or start from a city</h2>
          <Link href="/guide" className="text-sm text-clay-600 hover:underline">All destinations →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <Link key={d.slug} href={`/build/${d.slug}`} className="card group overflow-hidden">
              <div className="relative h-48 w-full overflow-hidden">
                <CoverImage imageKey={`city:${d.slug}`} query={d.heroImageQuery} alt={d.city} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="font-serif text-xl">{d.city}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{d.overviewMarkdown.split('. ')[0]}.</p>
                <span className="mt-3 inline-block text-sm text-clay-600">Build a {d.city} trip →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-wide py-12">
        <h2 className="font-serif text-3xl">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <div key={i} className="card p-6">
              <span className="font-serif text-3xl text-clay-400">{i + 1}</span>
              <h3 className="mt-2 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="container-wide py-12">
        <div className="card mx-auto max-w-prose p-8">
          <h2 className="font-serif text-3xl">Why Stitch</h2>
          <div className="mt-4 space-y-4 text-ink-soft">
            <p>
              Most travel sites give you the same list everyone else gets. That&apos;s why &ldquo;best ramen in
              Tokyo&rdquo; returns the same five shops on every blog since 2017.
            </p>
            <p>
              Stitch builds the trip around you. If you said no museums, no museums. If you said long lunches and
              slow mornings, your day starts at 10. If you hate tourist traps and we&apos;re going to recommend one
              anyway, we&apos;ll say why.
            </p>
            <p>The recommendations are specific. The reasoning is on the page. The booking is one click. That&apos;s the product.</p>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="container-wide py-12">
        <div className="mx-auto grid max-w-prose gap-6">
          {[
            ['How do you make money?', 'We earn a small commission when you book a hotel, tour, or restaurant through our links. It doesn’t change what you pay.'],
            ['Is this really free?', 'Yes. No signup, no paywall, no premium tier.'],
            ['How accurate are the recommendations?', 'Better than most. We ground suggestions in real, named places — not generic categories. If we don’t have current info on something, we say so.'],
          ].map(([q, a]) => (
            <div key={q}>
              <h3 className="font-medium">{q}</h3>
              <p className="mt-1 text-ink-soft">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
