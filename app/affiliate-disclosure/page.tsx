export const metadata = { title: 'Affiliate disclosure' }

export default function AffiliateDisclosure() {
  return (
    <div className="container-prose py-16">
      <h1 className="font-serif text-4xl">Affiliate disclosure</h1>
      <div className="mt-6 space-y-4 text-ink-soft">
        <p>
          Stitch earns commissions from booking partners when you click certain links on this site and complete a
          purchase. These commissions support our work and never increase the price you pay.
        </p>
        <p>
          We recommend services based on quality and fit for your trip, not commission rates. If we recommend a hotel,
          tour, restaurant, eSIM, or insurance policy, it&apos;s because we think it&apos;s the right call for the trip
          you described — the affiliate relationship comes after.
        </p>
        <p>Our partners include, among others:</p>
        <ul className="list-disc pl-6">
          <li>Booking.com and Hotellook for stays</li>
          <li>Kiwi.com and Booking.com Flights for flights</li>
          <li>Viator and GetYourGuide for tours and activities</li>
          <li>OpenTable for restaurant reservations</li>
          <li>Airalo for eSIMs and SafetyWing for travel insurance</li>
        </ul>
        <p>
          Every booking link on the site is marked as an affiliate link near the button group. You can always go
          directly to any partner without using our link. This disclosure is provided in line with the U.S. FTC&apos;s
          guidelines on endorsements.
        </p>
        <p className="text-sm text-ink-mute">Questions: hello@stitch.travel</p>
      </div>
    </div>
  )
}
