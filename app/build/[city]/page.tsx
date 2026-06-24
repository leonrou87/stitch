import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalogCitySlugs, placesForCity } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'
import { TripWizard } from '@/components/build/TripWizard'
import { BundleCard } from '@/components/build/BundleCard'
import { MultiCityCard } from '@/components/build/MultiCityCard'
import { bundlesForCity } from '@/lib/data/bundles'
import { multiCityForCity } from '@/lib/data/multicity'

interface Props { params: Promise<{ city: string }> }

export function generateStaticParams() {
  return catalogCitySlugs.map((city) => ({ city }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const dest = destinationBySlug(city)
  if (!dest) return { title: 'Build a trip' }
  return {
    alternates: { canonical: `/build/${city}` },
    title: `Build a ${dest.city} trip`,
    description: `Pick the places you want in ${dest.city} and we stitch them into a day-by-day itinerary.`,
  }
}

export default async function BuildCityPage({ params }: Props) {
  const { city } = await params
  const dest = destinationBySlug(city)
  if (!dest || placesForCity(city).length === 0) notFound()
  const cityBundles = bundlesForCity(city)
  const cityMulti = multiCityForCity(city)

  return (
    <>
      {cityMulti.length > 0 && (
        <section className="container-wide pt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay-600">Pair with a nearby city</p>
          <h2 className="mt-2 font-serif text-2xl">Make it a two-city trip</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cityMulti.map((t) => <MultiCityCard key={t.id} trip={t} />)}
          </div>
        </section>
      )}
      {cityBundles.length > 0 && (
        <section className="container-wide pt-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-clay-600">Start from a curated trip</p>
          <h2 className="mt-2 font-serif text-2xl">{dest.city}, already planned</h2>
          <p className="mt-1 max-w-prose text-sm text-ink-soft">
            Open a ready-made {dest.city} trip, adjust the dates and picks, and book. Or plan your own from scratch below.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cityBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
          </div>
          <div className="section-rule mt-12 text-xs font-semibold uppercase tracking-widest text-ink-mute">
            <span aria-hidden>✦</span>or plan your own
          </div>
        </section>
      )}
      <TripWizard citySlug={city} cityName={dest.city} />
    </>
  )
}
