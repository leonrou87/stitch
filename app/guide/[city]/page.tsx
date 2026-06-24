import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { destinationBySlug, destinations } from '@/lib/data/destinations'
import { DURATIONS, NICHES } from '@/lib/seo/guide'
import { bookingHotelSearchUrl } from '@/lib/affiliate/booking'
import { wrapAffiliate } from '@/lib/db/store'
import { CoverImage } from '@/components/ui/CoverImage'

interface Props { params: Promise<{ city: string }> }

export function generateStaticParams() {
  return destinations.map((d) => ({ city: d.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const d = destinationBySlug(city)
  if (!d) return { title: 'Not found' }
  return {
    title: `${d.city} travel guide`,
    description: `${d.overviewMarkdown.split('. ').slice(0, 2).join('. ')}.`,
    alternates: { canonical: `/guide/${city}` },
  }
}

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-rule mb-4 mt-12 text-sm font-semibold uppercase tracking-widest">
      <span aria-hidden>✦</span>{children}
    </h2>
  )
}

export default async function DestinationGuide({ params }: Props) {
  const { city } = await params
  const d = destinationBySlug(city)
  if (!d) notFound()

  const checkIn = '2026-09-10'
  const checkOut = '2026-09-14'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://stitch.kytepush.com'
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: d.city,
    description: d.overviewMarkdown,
    url: `${appUrl}/guide/${city}`,
    address: { '@type': 'PostalAddress', addressCountry: d.country },
    geo: { '@type': 'GeoCoordinates', latitude: d.lat, longitude: d.lng },
  }

  return (
    <article className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden">
        <CoverImage imageKey={`city:${d.slug}`} query={d.heroImageQuery} alt={d.city} priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="container-wide absolute inset-x-0 bottom-0 pb-8 text-white">
          <p className="text-sm uppercase tracking-widest text-paper/80">{d.country}</p>
          <h1 className="mt-1 text-4xl text-white sm:text-5xl">{d.city} travel guide</h1>
        </div>
      </div>

      <div className="container-wide mx-auto max-w-prose">
        <p className="mt-8 font-serif text-lg leading-relaxed text-ink-soft">{d.overviewMarkdown}</p>

        <SectionRule>When to visit</SectionRule>
        <div className="card p-6">
          <p className="text-ink-soft"><span className="font-medium">Best months:</span> {d.bestTimeToVisit.months.join(', ')}</p>
          <p className="mt-2 text-ink-soft">{d.bestTimeToVisit.notes}</p>
          {d.bestTimeToVisit.avoid && <p className="mt-2 text-sm text-ink-mute"><span className="font-medium">Avoid:</span> {d.bestTimeToVisit.avoid}</p>}
        </div>

        <SectionRule>Where to stay</SectionRule>
        <div className="space-y-3">
          {d.topNeighborhoods.map((n) => {
            const href = wrapAffiliate({
              itineraryId: null,
              provider: 'Booking.com',
              kind: 'hotel',
              targetUrl: bookingHotelSearchUrl({ query: `${n.name} ${d.city}`, checkIn, checkOut, adults: 2, children: 0 }),
            })
            return (
              <div key={n.name} className="card flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <h3 className="font-medium">{n.name}</h3>
                  <p className="text-sm text-ink-mute">{n.vibe} · best for {n.bestFor.join(', ')}</p>
                </div>
                <a href={href} target="_blank" rel="nofollow sponsored noopener" className="btn-ghost">Stays in {n.name}</a>
              </div>
            )
          })}
          <p className="text-[11px] uppercase tracking-wide text-ink-mute">affiliate links</p>
        </div>

        <SectionRule>Sample itineraries</SectionRule>
        <div className="grid gap-2 sm:grid-cols-2">
          {DURATIONS.filter((n) => [3, 4, 5, 7].includes(n)).map((n) => (
            <Link key={n} href={`/guide/${d.slug}/${n}-day-itinerary`} className="card p-4 hover:border-clay-400">
              {n} days in {d.city} →
            </Link>
          ))}
          {Object.entries(NICHES).map(([slug, n]) => (
            <Link key={slug} href={`/guide/${d.slug}/${slug}`} className="card p-4 hover:border-clay-400">
              {d.city} {n.label} →
            </Link>
          ))}
        </div>

        <div className="card mt-12 flex flex-col items-start gap-3 p-6">
          <h2 className="font-serif text-2xl">Plan your custom {d.city} trip</h2>
          <p className="text-ink-soft">Tell us your dates, budget, and pace, and we&apos;ll build something specific to you.</p>
          <Link href={`/plan?q=${encodeURIComponent(`A trip to ${d.city}`)}`} className="btn-clay">
            Build me a {d.city} itinerary ▸
          </Link>
        </div>
      </div>
    </article>
  )
}
