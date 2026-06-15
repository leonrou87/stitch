import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItineraryBySlug, incrementView } from '@/lib/db/store'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import { itineraryStructuredData } from '@/lib/seo/structured-data'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const record = await getItineraryBySlug(slug)
  if (!record) return { title: 'Itinerary not found' }
  const it = record.data
  return {
    title: `${it.dates.durationDays} days in ${it.destination.primaryCity}`,
    description: it.summary,
    openGraph: { title: `${it.dates.durationDays} days in ${it.destination.primaryCity}`, description: it.summary },
  }
}

export default async function ItineraryPage({ params }: Props) {
  const { slug } = await params
  const record = await getItineraryBySlug(slug)
  if (!record) notFound()

  await incrementView(slug)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const ld = itineraryStructuredData(record.data, `${appUrl}/i/${slug}`)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ItineraryView itinerary={record.data} itineraryId={record.id} slug={slug} />
      <div className="container-wide mx-auto max-w-prose">
        <div className="card mt-4 flex flex-col items-start gap-3 p-6">
          <h3 className="font-serif text-xl">Want to change it?</h3>
          <p className="text-ink-soft">
            Add or drop places, change the pace, add days — and re-stitch. Your booked check-offs
            are saved on this device.
          </p>
          <Link href="/build" className="btn-clay">Build another trip</Link>
        </div>
      </div>
    </>
  )
}
