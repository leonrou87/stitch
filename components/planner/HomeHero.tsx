'use client'

import Link from 'next/link'
import { catalogCitySlugs } from '@/lib/data/catalog'
import { destinationBySlug } from '@/lib/data/destinations'

export function HomeHero() {
  const cities = catalogCitySlugs.map((s) => destinationBySlug(s)).filter(Boolean)

  return (
    <div className="mx-auto mt-9 max-w-2xl text-center">
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/trips" className="btn-clay px-7 py-3 text-base">Browse curated trips ▸</Link>
        <Link href="/build" className="btn-ghost px-7 py-3 text-base">Build your own</Link>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-mute">or jump into a city</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {cities.map((d) => (
          <Link key={d!.slug} href={`/build/${d!.slug}`} className="chip hover:border-clay-400 hover:text-ink">
            {d!.city}
          </Link>
        ))}
      </div>
    </div>
  )
}
