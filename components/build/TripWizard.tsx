'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { placesForCity, type Place, type PlaceCategory } from '@/lib/data/catalog'
import { stitchItinerary } from '@/lib/plan/stitch'
import { suggestPlaces } from '@/lib/plan/suggest'
import { CoverImage } from '@/components/ui/CoverImage'
import type { FlightOption } from '@/lib/types/itinerary'

// Guided, step-by-step planner. One decision per screen so it's always clear what to do:
// dates → pace → things to do → food & drink → stay & travel → review. Curated trips drop
// straight into Review, pre-filled and adjustable. Saves server-side on a deliberate click.

type Pace = 'slow' | 'moderate' | 'packed'
type StepId = 'dates' | 'pace' | 'do' | 'eat' | 'stay' | 'review'

const STEPS: { id: StepId; label: string }[] = [
  { id: 'dates', label: 'Dates' },
  { id: 'pace', label: 'Pace' },
  { id: 'do', label: 'Things to do' },
  { id: 'eat', label: 'Food & drink' },
  { id: 'stay', label: 'Stay & travel' },
  { id: 'review', label: 'Review' },
]

const DO_CATS: PlaceCategory[] = ['sight', 'gallery', 'experience', 'outdoor']
const EAT_CATS: PlaceCategory[] = ['food', 'cafe', 'bar', 'market']

const SUGGESTED_DAYS: Record<string, number> = {
  tokyo: 4, kyoto: 3, paris: 4, rome: 3, barcelona: 3, lisbon: 3, london: 4,
  amsterdam: 3, istanbul: 3, bangkok: 3, seoul: 4, copenhagen: 3,
  'mexico-city': 4, 'new-york-city': 4,
}

const PACES: { id: Pace; title: string; blurb: string }[] = [
  { id: 'slow', title: 'Relaxed', blurb: 'A few things a day, long meals, room to wander.' },
  { id: 'moderate', title: 'Balanced', blurb: 'A solid day without rushing. The default.' },
  { id: 'packed', title: 'Busy', blurb: 'See as much as you can. Full days.' },
]

const CAT_LABEL: Record<PlaceCategory, string> = {
  cafe: 'Café', food: 'Food', bar: 'Bar', sight: 'Sight', gallery: 'Art', experience: 'Experience',
  outdoor: 'Outdoors', shop: 'Shop', market: 'Market', stay: 'Stay',
}
const dollars = (n: number) => '$'.repeat(n)

export function TripWizard({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const router = useRouter()
  const all = useMemo(() => placesForCity(citySlug).filter((p) => p.category !== 'stay'), [citySlug])
  const suggested = SUGGESTED_DAYS[citySlug] ?? 3

  const [stepIdx, setStepIdx] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [days, setDays] = useState(suggested)
  const [pace, setPace] = useState<Pace>('moderate')
  const [selected, setSelected] = useState<string[]>([])
  const [origin, setOrigin] = useState('')
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [flightMsg, setFlightMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Prefill from a curated trip / Edit link: ?add=ids&days=N&pace=x&step=review
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const ids = sp.get('add')
    if (ids) {
      const valid = ids.split(',').filter((id) => all.some((p) => p.id === id))
      if (valid.length) setSelected(valid)
    }
    const d = parseInt(sp.get('days') || '', 10)
    if (d >= 1 && d <= 14) setDays(d)
    const p = sp.get('pace')
    if (p === 'slow' || p === 'moderate' || p === 'packed') setPace(p)
    const step = sp.get('step')
    if (step) { const i = STEPS.findIndex((s) => s.id === step); if (i >= 0) setStepIdx(i) }
    // Prefill from saved account settings (home airport, default pace) — best-effort.
    fetch('/api/me/settings').then((r) => r.json()).then((d) => {
      if (d?.prefs?.homeAirport && !sp.get('add')) setOrigin(d.prefs.homeAirport)
      if (d?.prefs?.defaultPace && !sp.get('pace')) setPace(d.prefs.defaultPace)
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all])

  const step = STEPS[stepIdx]
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  // Pace nudges the ordering of choices.
  const sortByPace = (list: Place[]) =>
    [...list].sort((a, b) => paceScore(b, pace) - paceScore(a, pace))

  const doPlaces = sortByPace(all.filter((p) => DO_CATS.includes(p.category)))
  const eatPlaces = sortByPace(all.filter((p) => EAT_CATS.includes(p.category)))

  const selectedPlaces = all.filter((p) => selected.includes(p.id))
  const preview = useMemo(
    () => (selectedPlaces.length ? stitchItinerary(citySlug, selectedPlaces, { durationDays: days, pace, startDate: startDate || undefined, flights }) : null),
    [citySlug, selected, days, pace, startDate, flights], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const suggestions = useMemo(() => suggestPlaces(citySlug, selected, 3), [citySlug, selected])
  const baseArea = useMemo(() => mode(selectedPlaces.map((p) => p.neighborhood)), [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1))
  const back = () => setStepIdx((i) => Math.max(0, i - 1))
  const goReview = () => setStepIdx(STEPS.length - 1)

  async function getFlights() {
    if (!origin.trim()) return
    setFlightMsg('Looking up flights…')
    try {
      const res = await fetch(`/api/flights?origin=${encodeURIComponent(origin)}&city=${citySlug}&adults=2`)
      const data = await res.json()
      if (data.options?.length) { setFlights(data.options); setFlightMsg(null) }
      else { setFlights([]); setFlightMsg(`No estimate for "${origin}" — try an airport code like SFO or LHR.`) }
    } catch { setFlightMsg('Flight lookup failed. Try again.') }
  }

  async function save() {
    if (!preview || saving) return
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: preview }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) { router.push(data.url); return }
      setError("Couldn't save your trip. Give it another try."); setSaving(false)
    } catch { setError('Connection dropped while saving. Try again.'); setSaving(false) }
  }

  const canAdvance = step.id !== 'do' || selected.length > 0

  return (
    <div className="container-wide py-8 pb-28 lg:pb-12">
      <div className="mx-auto max-w-3xl">
        {/* Progress */}
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => i <= stepIdx && setStepIdx(i)}
                disabled={i > stepIdx}
                className={`flex items-center gap-1.5 ${i === stepIdx ? 'font-semibold text-ink' : i < stepIdx ? 'text-clay-600 hover:underline' : 'text-ink-mute'}`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] ${i < stepIdx ? 'bg-moss-500 text-white' : i === stepIdx ? 'bg-ink text-paper' : 'bg-paper-edge text-ink-mute'}`}>
                  {i < stepIdx ? '✓' : i + 1}
                </span>
                {s.label}
              </button>
              {i < STEPS.length - 1 && <span className="text-paper-edge">·</span>}
            </li>
          ))}
        </ol>

        <div className="mt-8">
          {step.id === 'dates' && (
            <Section title={`When are you going to ${cityName}?`} sub={`Most travelers give ${cityName} ${suggested}${suggested >= 5 ? '+' : '–' + (suggested + 1)} days. You can change this anytime.`}>
              <div className="card max-w-md space-y-5 p-6">
                <label className="block">
                  <span className="text-sm font-medium text-ink-soft">Start date (optional)</span>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-paper-edge bg-paper-card px-3 py-2 text-sm outline-none focus:border-clay-400" />
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-soft">How many days?</span>
                  <Stepper value={days} min={1} max={14} onChange={setDays} />
                </div>
                {days < suggested && <p className="text-sm text-clay-600">{cityName} rewards a little more time — {suggested} days is a comfortable minimum.</p>}
              </div>
            </Section>
          )}

          {step.id === 'pace' && (
            <Section title="What kind of trip is this?" sub="This shapes how full each day is and what we surface first.">
              <div className="grid gap-4 sm:grid-cols-3">
                {PACES.map((p) => (
                  <button key={p.id} onClick={() => setPace(p.id)}
                    className={`card p-5 text-left transition-colors ${pace === p.id ? 'ring-2 ring-clay-400' : 'hover:border-clay-300'}`}>
                    <h3 className="font-serif text-xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft">{p.blurb}</p>
                    {pace === p.id && <span className="mt-3 inline-block text-sm text-clay-600">Selected</span>}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {step.id === 'do' && (
            <PickStep
              title="What do you want to do?"
              sub="Sights, museums, experiences, time outdoors. Add anything that appeals — we'll arrange it."
              places={doPlaces} selected={selected} onToggle={toggle} />
          )}

          {step.id === 'eat' && (
            <PickStep
              title="Where do you want to eat and drink?"
              sub="Restaurants, cafés, bars, markets. Skip any you don't care about."
              places={eatPlaces} selected={selected} onToggle={toggle} optional />
          )}

          {step.id === 'stay' && (
            <Section title="Stay and travel" sub="We base your stay where most of your picks are. Add a flight estimate if you want.">
              <div className="space-y-4">
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Where you'll be based</p>
                  <p className="mt-1 font-serif text-xl">{baseArea ?? 'Pick a few places first'}</p>
                  <p className="mt-1 text-sm text-ink-soft">Your itinerary will suggest stays here, with live booking links you can compare.</p>
                </div>
                <div className="card p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Flights (optional)</p>
                  <div className="mt-2 flex gap-2">
                    <input value={origin} onChange={(e) => setOrigin(e.target.value.toUpperCase())} placeholder="From (e.g. SFO)"
                      className="w-full rounded-full border border-paper-edge bg-paper px-3 py-2 text-sm outline-none focus:border-clay-400" />
                    <button onClick={getFlights} className="btn-ghost shrink-0 text-sm">Estimate</button>
                  </div>
                  {flightMsg && <p className="mt-1.5 text-xs text-ink-mute">{flightMsg}</p>}
                  {flights.map((f, i) => (
                    <p key={i} className="mt-2 rounded-lg bg-paper p-2 text-sm text-ink-soft">
                      {f.outbound.from} → {f.outbound.to} · ~${f.estimatedPriceUsd.toLocaleString()} round trip · {f.outbound.durationHours}h
                    </p>
                  ))}
                  <p className="mt-2 text-xs text-ink-mute">Multi-city trips are coming soon.</p>
                </div>
              </div>
            </Section>
          )}

          {step.id === 'review' && (
            <Section title="Your trip" sub={`${days} days in ${cityName} · ${PACES.find((p) => p.id === pace)!.title.toLowerCase()} pace · ${selected.length} places`}>
              {!preview ? (
                <div className="card p-8 text-center text-ink-soft">
                  Add a few things to do and we'll arrange them into days.
                  <div className="mt-4"><button onClick={() => setStepIdx(2)} className="btn-clay">Pick things to do</button></div>
                </div>
              ) : (
                <>
                  <div className="card divide-y divide-paper-edge p-0">
                    {preview.days.map((d) => (
                      <div key={d.dayNumber} className="p-5">
                        <p className="font-serif text-lg">Day {d.dayNumber} · {d.title}</p>
                        <ul className="mt-2 space-y-1 text-sm text-ink-soft">
                          {d.activities.map((a, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="w-12 shrink-0 font-mono text-xs text-clay-600">{a.time}</span>
                              <span>{a.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">You might add</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                          <button key={s.place.id} onClick={() => toggle(s.place.id)} className="chip hover:border-clay-400 hover:text-ink">
                            ＋ {s.place.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button onClick={save} disabled={saving} className="btn-clay mt-6 w-full disabled:opacity-40">
                    {saving ? 'Saving your trip…' : 'Save & view trip'}
                  </button>
                  {error && <p className="mt-2 text-center text-sm text-clay-600">{error}</p>}
                </>
              )}
            </Section>
          )}
        </div>

        {/* Footer nav (desktop) */}
        {step.id !== 'review' && (
          <div className="mt-8 hidden items-center justify-between sm:flex">
            <button onClick={back} disabled={stepIdx === 0} className="btn-ghost disabled:opacity-0">Back</button>
            <div className="flex items-center gap-3">
              {(step.id === 'do' || step.id === 'eat') && <span className="text-sm text-ink-mute">{selected.length} added</span>}
              {selected.length > 0 && <button onClick={goReview} className="text-sm text-clay-600 hover:underline">Skip to review</button>}
              <button onClick={next} disabled={!canAdvance} className="btn-clay disabled:opacity-40">
                {step.id === 'stay' ? 'Review trip' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky nav */}
      {step.id !== 'review' && (
        <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-paper-edge bg-paper/95 px-4 py-3 backdrop-blur sm:hidden">
          <button onClick={back} disabled={stepIdx === 0} className="btn-ghost disabled:opacity-0">Back</button>
          <button onClick={next} disabled={!canAdvance} className="btn-clay flex-1 disabled:opacity-40">
            {step.id === 'stay' ? 'Review trip' : `Next${selected.length ? ` · ${selected.length} added` : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-serif text-3xl">{title}</h1>
      {sub && <p className="mt-2 text-ink-soft">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

function PickStep({ title, sub, places, selected, onToggle, optional }: {
  title: string; sub: string; places: Place[]; selected: string[]; onToggle: (id: string) => void; optional?: boolean
}) {
  return (
    <Section title={title} sub={sub}>
      <div className="grid gap-3 sm:grid-cols-2">
        {places.map((p) => {
          const added = selected.includes(p.id)
          return (
            <button key={p.id} onClick={() => onToggle(p.id)}
              className={`card flex overflow-hidden text-left transition-colors ${added ? 'ring-2 ring-clay-400' : 'hover:border-clay-300'}`}>
              <div className="relative h-auto w-24 shrink-0 overflow-hidden">
                <CoverImage imageKey={`place:${p.id}`} fallbackKey={`city:${p.citySlug}`} query={`${p.name} ${p.neighborhood}`} alt={p.name} className="absolute inset-0 h-full w-full" />
              </div>
              <div className="min-w-0 flex-1 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate font-medium">{p.name}</h3>
                  <span className={`shrink-0 text-xs ${added ? 'text-moss-600' : 'text-ink-mute'}`}>{added ? 'Added ✓' : 'Add ＋'}</span>
                </div>
                <p className="text-xs text-ink-mute">{CAT_LABEL[p.category]} · {p.neighborhood} · {dollars(p.priceLevel)}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{p.blurb}</p>
              </div>
            </button>
          )
        })}
      </div>
      {optional && <p className="mt-4 text-sm text-ink-mute">Optional — skip ahead if food isn't the focus.</p>}
    </Section>
  )
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <button aria-label="One fewer day" onClick={() => onChange(Math.max(min, value - 1))} className="h-8 w-8 rounded-full border border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400">−</button>
      <span className="w-6 text-center font-medium">{value}</span>
      <button aria-label="One more day" onClick={() => onChange(Math.min(max, value + 1))} className="h-8 w-8 rounded-full border border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400">＋</button>
    </div>
  )
}

function paceScore(p: Place, pace: Pace): number {
  if (pace === 'slow') return (p.tags.includes('relaxed') ? 2 : 0) + (p.tags.includes('view') || p.category === 'outdoor' ? 1 : 0)
  if (pace === 'packed') return (p.tags.includes('classic') ? 2 : 0) + (['sight', 'gallery'].includes(p.category) ? 1 : 0)
  return p.tags.includes('classic') ? 1 : 0
}

function mode(arr: string[]): string | undefined {
  const c = new Map<string, number>()
  let best: string | undefined, bestN = 0
  for (const x of arr) { const n = (c.get(x) ?? 0) + 1; c.set(x, n); if (n > bestN) { bestN = n; best = x } }
  return best
}
