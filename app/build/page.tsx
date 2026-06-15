import Link from 'next/link'
import { catalogCitySlugs, placesForCity } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'
import { CoverImage } from '@/components/ui/CoverImage'

export const metadata = {
  title: 'Build a trip',
  description: 'Pick a city, choose the real places you want, and we stitch them into a day-by-day itinerary.',
}

export default function BuildIndex() {
  const cities = catalogCitySlugs
    .map((slug) => ({ slug, dest: destinationBySlug(slug), count: placesForCity(slug).filter((p) => p.category !== 'stay').length }))
    .filter((c) => c.dest)

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">Build a trip</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Start with a city. Browse the real places worth your time, add the ones you want, and we
        stitch them into days — no AI guessing, just your picks arranged well.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map(({ slug, dest, count }) => (
          <Link key={slug} href={`/build/${slug}`} className="card group overflow-hidden">
            <div className="relative h-44 w-full overflow-hidden">
              <CoverImage imageKey={`city:${slug}`} query={dest!.heroImageQuery} alt={dest!.city} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl">{dest!.city}</h2>
                <span className="text-xs text-ink-mute">{count} places</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{dest!.overviewMarkdown.split('. ')[0]}.</p>
              <span className="mt-3 inline-block text-sm text-clay-600">Build a {dest!.city} trip →</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink-mute">
        More cities are being added to the catalog. Want one prioritized? It&apos;s a data file, not a model retrain.
      </p>
    </div>
  )
}
