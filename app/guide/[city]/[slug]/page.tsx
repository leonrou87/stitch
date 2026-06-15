import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { destinationBySlug, destinations } from '@/lib/data/destinations'
import { guideRequest, DURATIONS, nicheSlugs } from '@/lib/seo/guide'
import { generateItineraryFallback } from '@/lib/ai/fallback'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import { itineraryStructuredData } from '@/lib/seo/structured-data'

interface Props { params: Promise<{ city: string; slug: string }> }

export function generateStaticParams() {
  const params: { city: string; slug: string }[] = []
  for (const d of destinations) {
    for (const n of DURATIONS) params.push({ city: d.slug, slug: `${n}-day-itinerary` })
    for (const s of nicheSlugs) params.push({ city: d.slug, slug: s })
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params
  const d = destinationBySlug(city)
  if (!d) return { title: 'Not found' }
  const built = guideRequest(d, slug)
  if (!built) return { title: 'Not found' }
  return { title: built.title, description: built.lede }
}

export default async function GuideItineraryPage({ params }: Props) {
  const { city, slug } = await params
  const d = destinationBySlug(city)
  if (!d) notFound()
  const built = guideRequest(d, slug)
  if (!built) notFound()

  // Deterministic sample itinerary — no API key or DB needed.
  const itinerary = await attachAffiliateLinks(generateItineraryFallback(built.request), built.request)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const ld = itineraryStructuredData(itinerary, `${appUrl}/guide/${city}/${slug}`)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="container-wide mx-auto max-w-prose pt-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-clay-600">
          <Link href={`/guide/${d.slug}`} className="hover:underline">{d.city} guide</Link> · sample itinerary
        </p>
        <h1 className="mt-2 font-serif text-4xl">{built.title}</h1>
        <p className="mt-3 text-ink-soft">{built.lede}</p>
      </div>

      <ItineraryView itinerary={itinerary} itineraryId={null} heroQuery={d.heroImageQuery} />

      <div className="container-wide mx-auto max-w-prose">
        <div className="card flex flex-col items-start gap-3 p-6">
          <h2 className="font-serif text-2xl">Make this trip yours</h2>
          <p className="text-ink-soft">
            This itinerary is a starting point. Tell us about your trip and we&apos;ll build something specific —
            different food preferences, different pace, different duration, kids, accessibility needs, all of it.
          </p>
          <Link href={`/plan?q=${encodeURIComponent(built.request.rawUserMessage)}`} className="btn-clay">
            Build me a custom {d.city} itinerary ▸
          </Link>
        </div>
      </div>
    </>
  )
}
