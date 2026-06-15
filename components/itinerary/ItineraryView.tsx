import type { Itinerary, Activity, Day, Stay, FlightOption } from '@/lib/types/itinerary'
import { AffiliateButtons } from './AffiliateButtons'
import { ItineraryActions } from './ItineraryActions'
import { formatBudgetRange, travelerLine, middot } from '@/lib/utils'
import { CoverImage } from '@/components/ui/CoverImage'
import { destinationByCity } from '@/lib/data/destinations'

const TYPE_ICON: Record<string, string> = {
  explore: '🚶', museum: '🏛', gallery: '🖼', restaurant: '🍽', cafe: '☕', bar: '🍸',
  shopping: '🛍', experience: '✨', outdoor: '⛰', transport: '🚆', rest: '🛏',
  show: '🎭', class: '🎓', sightseeing: '📸', nightlife: '🌃', other: '•',
}

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="section-rule mb-5 mt-14 text-sm font-semibold uppercase tracking-widest">
      <span aria-hidden>✦</span>
      {children}
    </h2>
  )
}

export function ItineraryView({
  itinerary,
  itineraryId,
  slug = 'sample',
  heroQuery,
}: {
  itinerary: Itinerary
  itineraryId: string | null
  slug?: string
  heroQuery?: string
}) {
  const it = itinerary
  const dest = destinationByCity(it.destination.primaryCity)
  const hero = heroQuery ?? dest?.heroImageQuery ?? `${it.destination.primaryCity} travel`
  const budget = formatBudgetRange(it.preferences.budgetTotalUsd, it.dates.durationDays)
  const dateLine = it.dates.start && it.dates.end
    ? `${it.dates.start} → ${it.dates.end}`
    : it.dates.flexible ? 'Flexible dates' : `${it.dates.durationDays} days`

  return (
    <article className="pb-16">
      {/* Hero */}
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <CoverImage imageKey={dest ? `city:${dest.slug}` : undefined} query={hero} alt={it.destination.primaryCity} priority className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="container-wide absolute inset-x-0 bottom-0">
          <div className="pb-8 text-paper">
            <p className="text-sm uppercase tracking-widest text-paper/80">
              {middot([it.destination.primaryCity, it.destination.country])}
            </p>
            <h1 className="mt-1 max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
              {it.dates.durationDays} days in {it.destination.primaryCity}
            </h1>
            {it.preferences.vibeTags.length > 0 && (
              <p className="mt-2 text-paper/90">{middot(it.preferences.vibeTags)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-wide -mt-6 relative">
        {/* Overview card */}
        <div className="card grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="chip">{travelerLine(it.travelers.adults, it.travelers.children)}</span>
              <span className="chip">{dateLine}</span>
              {budget && <span className="chip">Est. {budget}</span>}
              {it.preferences.pace && <span className="chip">{it.preferences.pace} pace</span>}
            </div>
            <p className="mt-4 max-w-prose font-serif text-lg leading-relaxed text-ink-soft">{it.summary}</p>
          </div>
          <ItineraryActions />
        </div>

        <div className="mx-auto max-w-prose">
          {it.preTrip && <PreTrip it={it} itineraryId={itineraryId} slug={slug} />}
          {it.flights?.length ? <Flights flights={it.flights} itineraryId={itineraryId} slug={slug} /> : null}
          {it.stays?.length ? <Stays stays={it.stays} itineraryId={itineraryId} slug={slug} /> : null}

          {it.days.map((day) => (
            <DayBlock key={day.dayNumber} day={day} itineraryId={itineraryId} slug={slug} />
          ))}

          {it.restaurantsAppendix?.length ? (
            <>
              <SectionRule>Restaurants worth a trip</SectionRule>
              <div className="space-y-4">
                {it.restaurantsAppendix.map((r, i) => (
                  <div key={i} className="card p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl">{r.name}</h3>
                      <span className="text-sm text-ink-mute">{r.priceRange} · {r.cuisine}</span>
                    </div>
                    {r.neighborhood && <p className="text-sm text-ink-mute">{r.neighborhood}</p>}
                    {r.whatToOrder && <p className="mt-2 text-ink-soft"><span className="font-medium">Order:</span> {r.whatToOrder}</p>}
                    {r.notes && <p className="mt-1 text-ink-soft">{r.notes}</p>}
                    <AffiliateButtons links={r.affiliateLinks} itineraryId={itineraryId} slug={slug} compact />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {it.gettingAround && <GettingAround it={it} />}
          {it.practical && <Practical it={it} />}
        </div>
      </div>
    </article>
  )
}

function PreTrip({ it, itineraryId, slug }: { it: Itinerary; itineraryId: string | null; slug: string }) {
  const p = it.preTrip!
  return (
    <>
      <SectionRule>Pre-trip</SectionRule>
      <div className="card space-y-4 p-6">
        {p.visaNotes && <Fact label="Visa" value={p.visaNotes} />}
        {p.passportCheck && <Fact label="Passport" value={p.passportCheck} />}
        {p.currencyNotes && <Fact label="Money" value={p.currencyNotes} />}
        {p.packingTips?.length ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Packing</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-ink-soft">
              {p.packingTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        ) : null}
        {p.appsToInstall?.length ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Apps to install</p>
            <ul className="mt-1 space-y-1 text-ink-soft">
              {p.appsToInstall.map((a, i) => <li key={i}><span className="font-medium">{a.name}</span> — {a.why}</li>)}
            </ul>
          </div>
        ) : null}
        <AffiliateButtons
          links={[...(p.insuranceRecommendations ?? []), ...(p.esimRecommendations ?? [])]}
          itineraryId={itineraryId}
          slug={slug}
          label="Sort before you go"
        />
      </div>
    </>
  )
}

function Flights({ flights, itineraryId, slug }: { flights: FlightOption[]; itineraryId: string | null; slug: string }) {
  return (
    <>
      <SectionRule>Flights</SectionRule>
      <div className="space-y-4">
        {flights.map((f, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-xl">{f.optionLabel}</h3>
              <span className="text-lg font-medium text-clay-600">~${f.estimatedPriceUsd.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-ink-soft">
              {f.outbound.from} → {f.outbound.to} · {f.outbound.carrier} · {f.outbound.durationHours}h
              {f.outbound.stops === 0 ? ' · nonstop' : ` · ${f.outbound.stops} stop`}
            </p>
            {f.rationale && <p className="mt-2 text-sm text-ink-mute">{f.rationale}</p>}
            <AffiliateButtons links={f.affiliateLinks} itineraryId={itineraryId} slug={slug} compact />
          </div>
        ))}
      </div>
    </>
  )
}

function Stays({ stays, itineraryId, slug }: { stays: Stay[]; itineraryId: string | null; slug: string }) {
  return (
    <>
      <SectionRule>Where to stay</SectionRule>
      {stays.map((stay, si) => (
        <div key={si} className="mb-6">
          <div className="mb-3">
            <h3 className="font-serif text-2xl">{stay.neighborhood}</h3>
            <p className="text-sm text-ink-mute">{stay.nightRange}</p>
            <p className="mt-1 text-ink-soft">{stay.rationale}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stay.options.map((o, oi) => (
              <div key={oi} className="card p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-medium">{o.name}</h4>
                  <span className="text-sm text-ink-mute capitalize">{o.tier}</span>
                </div>
                <p className="mt-1 text-clay-600">~${o.estimatedPriceUsdPerNight}/night{o.rating ? ` · ${o.rating}★` : ''}</p>
                <p className="mt-2 text-sm text-ink-soft">{o.rationale}</p>
                <AffiliateButtons links={o.affiliateLinks} itineraryId={itineraryId} slug={slug} compact />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function DayBlock({ day, itineraryId, slug }: { day: Day; itineraryId: string | null; slug: string }) {
  return (
    <section className="break-inside-avoid">
      <SectionRule>Day {day.dayNumber}: {day.title}</SectionRule>
      <p className="-mt-2 mb-5 font-serif text-lg leading-relaxed text-ink-soft">{day.narrative}</p>
      <ol className="relative space-y-5 border-l border-paper-edge pl-6">
        {day.activities.map((a, i) => <ActivityItem key={i} a={a} itineraryId={itineraryId} slug={slug} />)}
      </ol>
    </section>
  )
}

function ActivityItem({ a, itineraryId, slug }: { a: Activity; itineraryId: string | null; slug: string }) {
  return (
    <li className="relative">
      <span className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full bg-paper text-[11px] ring-1 ring-paper-edge">
        {TYPE_ICON[a.type] ?? '•'}
      </span>
      <div className="flex flex-wrap items-baseline gap-x-3">
        {a.time && <span className="font-mono text-sm text-clay-600">{a.time}</span>}
        <h4 className="font-medium">{a.title}</h4>
        {typeof a.costEstimateUsd === 'number' && a.costEstimateUsd > 0 && (
          <span className="text-sm text-ink-mute">~${a.costEstimateUsd}</span>
        )}
      </div>
      {a.location?.name && (
        <p className="text-sm text-ink-mute">
          {a.location.name}{a.location.neighborhood ? ` · ${a.location.neighborhood}` : ''}
          {a.location.address ? ` · ${a.location.address}` : ''}
        </p>
      )}
      <p className="mt-1 text-ink-soft">{a.description}</p>
      {a.whyThis && <p className="mt-1 text-sm italic text-ink-mute">{a.whyThis}</p>}
      {a.tips?.length ? (
        <ul className="mt-1 list-disc pl-5 text-sm text-ink-mute">
          {a.tips.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      ) : null}
      <AffiliateButtons links={a.affiliateLinks} itineraryId={itineraryId} slug={slug} compact />
    </li>
  )
}

function GettingAround({ it }: { it: Itinerary }) {
  const g = it.gettingAround!
  return (
    <>
      <SectionRule>Getting around</SectionRule>
      <div className="card space-y-3 p-6">
        {g.fromAirport && <Fact label="From the airport" value={g.fromAirport} />}
        {g.transitPass && <Fact label="Transit" value={g.transitPass} />}
        {g.rideshare && <Fact label="Rideshare" value={g.rideshare} />}
        {g.walkability && <Fact label="On foot" value={g.walkability} />}
        {g.cyclingNotes && <Fact label="Cycling" value={g.cyclingNotes} />}
      </div>
    </>
  )
}

function Practical({ it }: { it: Itinerary }) {
  const p = it.practical!
  return (
    <>
      <SectionRule>Practical things</SectionRule>
      <div className="card grid gap-3 p-6 sm:grid-cols-2">
        {p.emergencyNumber && <Fact label="Emergency" value={p.emergencyNumber} />}
        {p.plugType && <Fact label="Plugs" value={`${p.plugType}${p.voltage ? ` · ${p.voltage}` : ''}`} />}
        {p.tipping && <Fact label="Tipping" value={p.tipping} />}
        {p.safety && <Fact label="Safety" value={p.safety} />}
      </div>
      {p.commonPhrases?.length ? (
        <div className="card mt-4 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Useful phrases</p>
          <ul className="mt-2 space-y-1 text-ink-soft">
            {p.commonPhrases.map((ph, i) => (
              <li key={i}><span className="font-medium">{ph.phrase}</span>{ph.pronunciation ? ` (${ph.pronunciation})` : ''} — {ph.meaning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-mute">{label}</span>
      <p className="text-ink-soft">{value}</p>
    </div>
  )
}
