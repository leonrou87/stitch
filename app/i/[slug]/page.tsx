import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItineraryBySlug, incrementView } from '@/lib/db/store'
import { ItineraryView } from '@/components/itinerary/ItineraryView'
import { RecordTrip } from '@/components/trips/RecordTrip'
import { TripEditor } from '@/components/itinerary/TripEditor'
import { EmailTrip } from '@/components/trips/EmailTrip'
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
    alternates: { canonical: `/i/${slug}` },
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
        <RecordTrip
          slug={slug}
          title={`${record.data.dates.durationDays} days in ${record.data.destination.primaryCity}`}
          city={record.data.destination.primaryCity}
          days={record.data.dates.durationDays}
        />
        <TripEditor
          slug={slug}
          citySlug={record.data.source?.citySlug}
          placeIds={record.data.source?.placeIds ?? []}
          days={record.data.dates.durationDays}
          pace={record.data.preferences.pace}
          hasSource={Boolean(record.data.source)}
          editorDays={record.data.days.map((d) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            activities: d.activities.map((a) => ({ title: a.title })),
          }))}
        />
        <div className="card mt-4 flex flex-col items-start gap-3 p-6">
          <h3 className="font-serif text-xl">Keep this trip</h3>
          <p className="text-ink-soft">
            It&apos;s saved to your trips on this device, and lives at this link to share. Want it in your inbox too?
          </p>
          <EmailTrip slug={slug} title={`${record.data.dates.durationDays} days in ${record.data.destination.primaryCity}`} />
          <Link href="/build" className="mt-2 text-sm text-clay-600 hover:underline">Plan another trip →</Link>
        </div>
      </div>
    </>
  )
}
