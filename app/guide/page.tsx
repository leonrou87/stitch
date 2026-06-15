import Link from 'next/link'
import { destinations } from '@/lib/data/destinations'
import { CoverImage } from '@/components/ui/CoverImage'

export const metadata = {
  title: 'Destinations',
  description: 'Travel guides and sample itineraries for 30 destinations — real neighborhoods, when to visit, where to stay.',
}

export default function GuideIndex() {
  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">Destinations</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Guides for {destinations.length} cities — where to stay, when to go, and sample itineraries you can make
        your own. Each one is a starting point for the planner.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Link key={d.slug} href={`/guide/${d.slug}`} className="card group overflow-hidden">
            <div className="relative h-44 w-full overflow-hidden">
              <CoverImage imageKey={`city:${d.slug}`} query={d.heroImageQuery} alt={d.city} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl">{d.city}</h2>
                <span className="text-xs text-ink-mute">{d.country}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{d.overviewMarkdown.split('. ')[0]}.</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
