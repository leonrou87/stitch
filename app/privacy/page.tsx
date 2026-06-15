export const metadata = { title: 'Privacy policy' }

export default function Privacy() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-ink-mute">Template starting point. Replace with your Termly/Iubenda policy before launch.</p>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>Stitch is built to collect as little as possible. You can plan a trip without an account.</p>
        <h2 className="font-serif text-2xl">What we collect</h2>
        <ul className="list-disc pl-6">
          <li>Trip requests you type into the planner, and the itineraries we generate from them.</li>
          <li>If you create an account, your email and saved preferences.</li>
          <li>Anonymous analytics and affiliate click events to understand what&apos;s useful.</li>
        </ul>
        <h2 className="font-serif text-2xl">What we don&apos;t do</h2>
        <p>We never take payment from you, and we don&apos;t sell your data. Affiliate partners set their own cookies when you follow a booking link.</p>
        <h2 className="font-serif text-2xl">Your rights</h2>
        <p>Email hello@stitch.travel to export or delete your data. We honor GDPR and CCPA requests.</p>
      </div>
    </div>
  )
}
