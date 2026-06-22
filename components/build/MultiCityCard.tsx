import Link from 'next/link'
import { CoverImage } from '@/components/ui/CoverImage'
import { multiCityLegs, type MultiCityTrip } from '@/lib/data/multicity'
import { destinationBySlug } from '@/lib/data/destinations'

// A two-city trip. "Use this trip" builds and saves it server-side via /multi/[id].
export function MultiCityCard({ trip }: { trip: MultiCityTrip }) {
  const legs = multiCityLegs(trip)
  const totalDays = legs.reduce((n, l) => n + l.days, 0)
  const firstCity = legs[0]?.citySlug

  return (
    <div className="card group flex flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <CoverImage imageKey={firstCity ? `city:${firstCity}` : undefined} query={trip.heroQuery} alt={trip.title} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-clay-700">
          {trip.theme}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl">{trip.title}</h3>
        <p className="mt-1 text-xs text-ink-mute">
          {totalDays} days · {legs.map((l) => destinationBySlug(l.citySlug)?.city ?? l.citySlug).join(' → ')}
        </p>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{trip.tagline}</p>
        <Link href={`/multi/${trip.id}`} className="btn-clay mt-4 text-sm" prefetch={false}>Use this trip</Link>
      </div>
    </div>
  )
}
