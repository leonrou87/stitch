import Link from 'next/link'
import { bundles } from '@/lib/data/bundles'
import { destinationBySlug } from '@/lib/data/destinations'
import { BundleCard } from '@/components/build/BundleCard'
import { MultiCityCard } from '@/components/build/MultiCityCard'
import { multiCityTrips } from '@/lib/data/multicity'

export const metadata = {
  alternates: { canonical: '/trips' },
  title: 'Curated trips',
  description: 'Ready-made, themed itineraries — pick one and go, or tweak it to fit. No assembly required.',
}

export default function TripsPage() {
  const byCity = bundles.reduce<Record<string, typeof bundles>>((acc, b) => {
    ;(acc[b.citySlug] ??= []).push(b)
    return acc
  }, {})

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">Curated trips</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Ready-made trips with a clear theme. Tap <span className="font-medium">Use this trip</span> for
        a finished itinerary in one go, or <span className="font-medium">Edit</span> to adjust the picks first.
      </p>

      {multiCityTrips.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-2xl">Across two cities</h2>
          <p className="mt-1 text-sm text-ink-soft">Pair up nearby cities into one trip, with the train hop built in.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {multiCityTrips.map((t) => <MultiCityCard key={t.id} trip={t} />)}
          </div>
        </section>
      )}

      {Object.entries(byCity).map(([slug, list]) => {
        const dest = destinationBySlug(slug)
        return (
          <section key={slug} className="mt-12">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-2xl">{dest?.city ?? slug}</h2>
              <Link href={`/build/${slug}`} className="text-sm text-clay-600 hover:underline">Build your own →</Link>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((b) => <BundleCard key={b.id} bundle={b} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
