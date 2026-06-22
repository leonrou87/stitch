import Link from 'next/link'
import { MyTripsList } from '@/components/trips/MyTripsList'
import { currentUserId, clerkEnabled } from '@/lib/auth/clerk'
import { listItinerariesByOwner } from '@/lib/db/store'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My trips', robots: { index: false } }

export default async function MyTripsPage() {
  const userId = await currentUserId()
  const accountTrips = userId ? await listItinerariesByOwner(userId) : []

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">My trips</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        {userId
          ? 'Saved to your account, so they follow you to any device.'
          : 'Trips you’ve built or opened, saved on this device. Each one also has a link you can share.'}
      </p>

      {userId && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">In your account</h2>
          {accountTrips.length === 0 ? (
            <p className="mt-3 text-ink-soft">No saved trips yet. Build one and it sticks to your account.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {accountTrips.map((t) => (
                <Link key={t.slug} href={`/i/${t.slug}`} className="card flex items-center justify-between gap-4 p-4 hover:border-clay-400">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-serif text-lg">{t.durationDays} days in {t.destinationCity}</span>
                    <span className="text-sm text-ink-mute">{t.destinationCountry}</span>
                  </span>
                  <span className="btn-ghost text-sm">Open</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-10">
        {userId && <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-mute">On this device</h2>}
        <MyTripsList />
      </section>

      {clerkEnabled && !userId && (
        <p className="mt-6 text-sm text-ink-mute">Sign in to save trips to your account and keep them across devices.</p>
      )}
    </div>
  )
}
