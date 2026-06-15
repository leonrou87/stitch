import { clickStatsByProvider, listItineraries } from '@/lib/db/store'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Affiliate dashboard', robots: { index: false } }

// Local affiliate funnel: which providers are getting clicks. Not auth-protected — it's an
// operator view. Lock it behind auth before relying on it; partner dashboards are the source
// of truth for payouts. See AFFILIATE-SETUP.md.
export default async function AdminPage() {
  const [{ byProvider, totalClicks }, trips] = await Promise.all([
    clickStatsByProvider(),
    listItineraries({}),
  ])

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">Affiliate dashboard</h1>
      <p className="mt-2 text-sm text-ink-mute">
        Click funnel. Real earnings are reported in each partner&apos;s own dashboard — see
        <code className="mx-1 rounded bg-paper px-1">AFFILIATE-SETUP.md</code>.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Stat label="Itineraries saved" value={trips.length} />
        <Stat label="Total affiliate clicks" value={totalClicks} />
      </div>

      <h2 className="section-rule mt-12 mb-4 text-sm font-semibold uppercase tracking-widest">
        <span aria-hidden>✦</span>Clicks by provider
      </h2>
      {byProvider.length === 0 ? (
        <p className="text-ink-mute">No clicks yet. Open an itinerary and click a booking link to see it here.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-paper-edge bg-paper text-xs uppercase tracking-wide text-ink-mute">
              <tr><th className="p-3">Provider</th><th className="p-3">Clicks</th></tr>
            </thead>
            <tbody>
              {byProvider.map((s) => (
                <tr key={s.provider} className="border-b border-paper-edge last:border-0">
                  <td className="p-3 font-medium">{s.provider}</td>
                  <td className="p-3 text-clay-600">{s.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
    </div>
  )
}
