import { MyTripsList } from '@/components/trips/MyTripsList'

export const metadata = { title: 'My trips', robots: { index: false } }

export default function MyTripsPage() {
  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">My trips</h1>
      <p className="mt-3 max-w-prose text-ink-soft">
        Trips you&apos;ve built or opened, saved on this device. Each one also has its own link you can
        share or revisit.
      </p>
      <MyTripsList />
    </div>
  )
}
