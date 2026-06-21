import Link from 'next/link'

export const metadata = { title: 'Help & FAQ' }

const faqs = [
  {
    q: 'How does Stitch work?',
    a: (
      <>
        Two ways. Pick a curated trip we&apos;ve already built, or describe your own and we&apos;ll stitch one
        together. Either way you get a day-by-day itinerary — real neighborhoods, sensible pacing — with booking
        links to the partners you already use. Start from{' '}
        <Link href="/trips" className="text-clay-600 underline">curated trips</Link> or{' '}
        <Link href="/build" className="text-clay-600 underline">build your own</Link>.
      </>
    ),
  },
  {
    q: 'Is it free?',
    a: (
      <>
        Yes. No signup needed to plan a trip, and we never charge you. Stitch is affiliate-supported: we earn a
        small commission when you book through a partner link, which is what keeps the planner free. More in our{' '}
        <Link href="/affiliate-disclosure" className="text-clay-600 underline">affiliate disclosure</Link>.
      </>
    ),
  },
  {
    q: 'How do bookings work?',
    a: (
      <>
        We don&apos;t handle payment or hold your reservation. Each stay, tour, or table links out to the partner,
        and you book there directly. The &ldquo;Mark booked&rdquo; toggle is your own checklist — it lives in your
        itinerary so you can track what&apos;s done, nothing more.
      </>
    ),
  },
  {
    q: 'Can I save my trip?',
    a: (
      <>
        Your trips are saved on this device, so they&apos;re here when you come back. Every itinerary also has a
        shareable link — send it to whoever you&apos;re traveling with, or open it on another device.
      </>
    ),
  },
  {
    q: 'What about my data and privacy?',
    a: (
      <>
        We collect as little as possible and never sell your data. The full details are in our{' '}
        <Link href="/privacy" className="text-clay-600 underline">privacy policy</Link>.
      </>
    ),
  },
  {
    q: 'Still stuck?',
    a: (
      <>
        Send us a note from the{' '}
        <Link href="/contact" className="text-clay-600 underline">contact page</Link>. A real person reads every
        message and replies within a day or two.
      </>
    ),
  },
]

export default function Help() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">Help &amp; FAQ</h1>
      <p className="mt-4 max-w-prose text-ink-soft">
        The short version of how Stitch works. If your question isn&apos;t here,{' '}
        <Link href="/contact" className="text-clay-600 underline">reach out</Link>.
      </p>

      <div className="mt-10 space-y-8">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <h2 className="font-serif text-2xl text-ink">{faq.q}</h2>
            <p className="mt-2 max-w-prose leading-relaxed text-ink-soft">{faq.a}</p>
            <div className="section-rule mt-8" />
          </div>
        ))}
      </div>
    </div>
  )
}
