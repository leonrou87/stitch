import Link from 'next/link'
import { bundles } from '@/lib/data/bundles'
import { destinationBySlug } from '@/lib/data/destinations'
import { BundleCard } from '@/components/build/BundleCard'

export const metadata = {
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
        Short on time? Start from a ready-made trip with a clear theme. Tap <span className="font-medium">Use this trip</span> for
        a finished itinerary in one go, or <span className="font-medium">Tweak</span> to adjust the picks first.
      </p>

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
