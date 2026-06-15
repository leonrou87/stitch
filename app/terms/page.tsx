export const metadata = { title: 'Terms of service' }

export default function Terms() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">Terms of service</h1>
      <p className="mt-3 text-sm text-ink-mute">Template starting point. Have a lawyer review before launch.</p>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>Stitch provides travel itineraries for planning purposes. We are not a travel agency and we don&apos;t sell travel or process payments.</p>
        <h2 className="font-serif text-2xl">As-is</h2>
        <p>Itineraries are generated suggestions. Prices, availability, opening hours, and visa rules change — verify the details that matter before you book or travel. We&apos;re not responsible for a partner not honoring a booking made on their site.</p>
        <h2 className="font-serif text-2xl">Affiliate links</h2>
        <p>Some links earn us a commission. See our <a className="text-clay-600 underline" href="/affiliate-disclosure">Affiliate Disclosure</a>.</p>
        <h2 className="font-serif text-2xl">Acceptable use</h2>
        <p>Don&apos;t scrape, resell, or misrepresent the service. We may change or discontinue features.</p>
      </div>
    </div>
  )
}
