import Link from 'next/link'

export const metadata = { title: 'How it works' }

export default function About() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">How Stitch works</h1>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>
          Stitch is a free AI travel planner. You describe a trip in plain language; we build a day-by-day itinerary
          with real neighborhoods, sensible pacing, and one-click booking links to the partners you already use.
        </p>
        <p>
          We don&apos;t take payment and we don&apos;t add a markup. We earn a small commission when you book a stay,
          tour, or table through our links — that&apos;s what keeps the planner free. Recommendations are made on
          quality and fit, not commission rate. More in our{' '}
          <Link href="/affiliate-disclosure" className="text-clay-600 underline">affiliate disclosure</Link>.
        </p>
        <h2 className="font-serif text-2xl">The quality bar</h2>
        <p>
          Most travel sites hand everyone the same list. We aim for the opposite: specific places, honest trade-offs,
          and a trip shaped around what you actually said you wanted. If you said no museums, no museums. If you said
          slow mornings, your day starts late.
        </p>
        <h2 className="font-serif text-2xl">Pricing</h2>
        <p>Free. No signup to plan a trip. An optional account lets you save and revisit itineraries.</p>
        <div className="pt-2">
          <Link href="/plan" className="btn-clay">Plan a trip</Link>
        </div>
      </div>
    </div>
  )
}
