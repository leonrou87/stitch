import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalogCitySlugs, placesForCity } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'
import { BuildClient } from '@/components/build/BuildClient'
import { BundleCard } from '@/components/build/BundleCard'
import { bundlesForCity } from '@/lib/data/bundles'

interface Props { params: Promise<{ city: string }> }

export function generateStaticParams() {
  return catalogCitySlugs.map((city) => ({ city }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const dest = destinationBySlug(city)
  if (!dest) return { title: 'Build a trip' }
  return {
    title: `Build a ${dest.city} trip`,
    description: `Pick the places you want in ${dest.city} and we stitch them into a day-by-day itinerary.`,
  }
}

export default async function BuildCityPage({ params }: Props) {
  const { city } = await params
  const dest = destinationBySlug(city)
  if (!dest || placesForCity(city).length === 0) notFound()
  const cityBundles = bundlesForCity(city)

  return (
    <>
      {cityBundles.length > 0 && (
        <section className="container-wide pt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl">Start from a curated {dest.city} trip</h2>
              <p className="mt-1 text-sm text-ink-soft">Tap one for a finished itinerary, or build your own below.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cityBundles.map((b) => <BundleCard key={b.id} bundle={b} />)}
          </div>
          <div className="section-rule mt-10 text-sm font-semibold uppercase tracking-widest text-clay-600">
            <span aria-hidden>✦</span>or build your own
          </div>
        </section>
      )}
      <BuildClient citySlug={city} cityName={dest.city} />
    </>
  )
}
