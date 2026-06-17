'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { placesForCity, type Place, type PlaceCategory } from '@/lib/data/catalog'
import { stitchItinerary } from '@/lib/plan/stitch'
import { suggestPlaces } from '@/lib/plan/suggest'
import { CoverImage } from '@/components/ui/CoverImage'
import type { FlightOption } from '@/lib/types/itinerary'

const CAT_LABEL: Record<PlaceCategory, string> = {
  cafe: 'Cafés', food: 'Food', bar: 'Bars', sight: 'Sights', gallery: 'Art & museums',
  experience: 'Experiences', outdoor: 'Outdoors', shop: 'Shops', market: 'Markets', stay: 'Stays',
}
const dollars = (n: number) => '$'.repeat(n)

export function BuildClient({ citySlug, cityName }: { citySlug: string; cityName: string }) {
  const router = useRouter()
  const all = useMemo(() => placesForCity(citySlug).filter((p) => p.category !== 'stay'), [citySlug])

  const [selected, setSelected] = useState<string[]>([])
  const [cat, setCat] = useState<PlaceCategory | 'all'>('all')
  const [hood, setHood] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [duration, setDuration] = useState(3)
  const [pace, setPace] = useState<'slow' | 'moderate' | 'packed'>('moderate')
  const [origin, setOrigin] = useState('')
  const [flights, setFlights] = useState<FlightOption[]>([])
  const [flightMsg, setFlightMsg] = useState<string | null>(null)
  const [showFlights, setShowFlights] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Deep-link preselection for "Edit": /build/[city]?add=id1,id2 loads those picks.
  // (One-tap curated trips save server-side via /go/[bundleId] — no client auto-save.)
  useEffect(() => {
    const ids = new URLSearchParams(window.location.search).get('add')
    if (ids) {
      const valid = ids.split(',').filter((id) => all.some((p) => p.id === id))
      if (valid.length) setSelected(valid)
    }
  }, [all])

  const categories = useMemo(() => Array.from(new Set(all.map((p) => p.category))), [all])
  const neighborhoods = useMemo(() => Array.from(new Set(all.map((p) => p.neighborhood))).sort(), [all])

  const filtered = all.filter((p) =>
    (cat === 'all' || p.category === cat) &&
    (hood === 'all' || p.neighborhood === hood) &&
    (!query || `${p.name} ${p.blurb} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),
  )

  const selectedPlaces = all.filter((p) => selected.includes(p.id))
  const preview = useMemo(
    () => (selectedPlaces.length ? stitchItinerary(citySlug, selectedPlaces, { durationDays: duration, pace, flights }) : null),
    [citySlug, selected, duration, pace, flights], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const suggestions = useMemo(() => suggestPlaces(citySlug, selected, 2), [citySlug, selected])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  async function getFlights() {
    if (!origin.trim()) return
    setFlightMsg('Looking up flights…')
    try {
      const res = await fetch(`/api/flights?origin=${encodeURIComponent(origin)}&city=${citySlug}&adults=2`)
      const data = await res.json()
      if (data.options?.length) { setFlights(data.options); setFlightMsg(null) }
      else { setFlights([]); setFlightMsg(`No estimate for "${origin}" — try an airport code like SFO or LHR.`) }
    } catch {
      setFlightMsg('Flight lookup failed. Try again.')
    }
  }

  async function save() {
    if (!preview || saving) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: preview }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        router.push(data.url)
        return // keep the saving state through navigation
      }
      setError("Couldn't save your trip. Give it another try.")
      setSaving(false)
    } catch {
      setError('Connection dropped while saving. Try again.')
      setSaving(false)
    }
  }

  const count = selected.length

  return (
    <div className="container-wide py-8 pb-28 lg:pb-8">
      {/* One-line instruction */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl">{cityName}</h1>
        <p className="mt-1 text-lg text-ink-soft">Pick a few places. We arrange them into days.</p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        {/* Catalog */}
        <div>
          {/* Calm, single-row filters */}
          <div className="sticky top-16 z-10 -mx-1 mb-5 space-y-2.5 bg-paper/85 px-1 py-3 backdrop-blur">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cityName}`}
              className="w-full rounded-full border border-paper-edge bg-paper-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-clay-400"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip active={cat === 'all'} onClick={() => setCat('all')}>All types</FilterChip>
              {categories.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>{CAT_LABEL[c]}</FilterChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <FilterChip active={hood === 'all'} onClick={() => setHood('all')}>All areas</FilterChip>
              {neighborhoods.map((n) => (
                <FilterChip key={n} active={hood === n} onClick={() => setHood(n)}>{n}</FilterChip>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p) => (
              <PlaceCard key={p.id} place={p} added={selected.includes(p.id)} onToggle={() => toggle(p.id)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-ink-mute">Nothing matches those filters. Try clearing one.</p>
          )}
        </div>

        {/* Tray */}
        <aside className="lg:sticky lg:top-16 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pb-8">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl">Your trip</h2>
              <span className="text-sm text-ink-mute">{count} place{count === 1 ? '' : 's'}</span>
            </div>

            {/* Trip shape */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Days</span>
                <Stepper value={duration} min={1} max={10} onChange={setDuration} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink-soft">Pace</span>
                <div className="flex gap-1">
                  {(['slow', 'moderate', 'packed'] as const).map((p) => (
                    <FilterChip key={p} active={pace === p} onClick={() => setPace(p)}>{p}</FilterChip>
                  ))}
                </div>
              </div>
            </div>

            {count === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-paper-edge bg-paper px-4 py-8 text-center">
                <p className="text-sm text-ink-soft">Add a few places and we&apos;ll arrange them into days.</p>
              </div>
            ) : (
              <>
                {/* Live preview */}
                {preview && (
                  <div className="mt-5 border-t border-paper-edge pt-4">
                    <div className="space-y-4">
                      {preview.days.map((d) => (
                        <div key={d.dayNumber}>
                          <p className="text-sm font-semibold">Day {d.dayNumber} · {d.title}</p>
                          <ul className="mt-1.5 space-y-1 text-sm text-ink-soft">
                            {d.activities.map((a, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="w-12 shrink-0 font-mono text-xs text-clay-600">{a.time}</span>
                                <span>{a.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-5 border-t border-paper-edge pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">You might add</p>
                    <div className="mt-2 space-y-1.5">
                      {suggestions.map((s) => (
                        <button
                          key={s.place.id}
                          onClick={() => toggle(s.place.id)}
                          className="flex w-full items-start gap-2 rounded-lg border border-paper-edge bg-paper p-2.5 text-left text-sm transition-colors hover:border-clay-400"
                        >
                          <span className="mt-0.5 text-clay-500">＋</span>
                          <span>
                            <span className="font-medium">{s.place.name}</span>
                            <span className="block text-xs text-ink-mute">{s.reason}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={save}
              disabled={!preview || saving}
              className="btn-clay mt-5 w-full disabled:opacity-40"
            >
              {saving ? 'Arranging your days…' : 'See my itinerary'}
            </button>
            {error && <p className="mt-2 text-center text-sm text-clay-600">{error}</p>}

            {/* Flights — quiet, optional, tucked away */}
            <div className="mt-3 border-t border-paper-edge pt-3">
              {!showFlights ? (
                <button
                  onClick={() => setShowFlights(true)}
                  className="text-xs text-ink-mute underline-offset-2 hover:text-ink-soft hover:underline"
                >
                  Add a flight estimate
                </button>
              ) : (
                <div>
                  <div className="flex gap-2">
                    <input
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                      placeholder="From (e.g. SFO)"
                      className="w-full rounded-full border border-paper-edge bg-paper px-3 py-1.5 text-sm outline-none focus:border-clay-400"
                    />
                    <button onClick={getFlights} className="btn-ghost shrink-0 px-3 py-1.5 text-sm">Check</button>
                  </div>
                  {flightMsg && <p className="mt-1.5 text-xs text-ink-mute">{flightMsg}</p>}
                  {flights.map((f, i) => (
                    <div key={i} className="mt-2 rounded-lg bg-paper p-2 text-xs text-ink-soft">
                      <span className="font-medium">{f.outbound.from} → {f.outbound.to}</span> · ~${f.estimatedPriceUsd.toLocaleString()} rt · {f.outbound.durationHours}h
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-paper-edge bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={save}
          disabled={!preview || saving}
          className="btn-clay flex w-full items-center justify-center gap-2 disabled:opacity-40"
        >
          {saving
            ? 'Arranging your days…'
            : count === 0
              ? 'Add a few places to start'
              : `See my itinerary · ${count} place${count === 1 ? '' : 's'}`}
        </button>
      </div>
    </div>
  )
}

function PlaceCard({ place, added, onToggle }: { place: Place; added: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`card group flex flex-col overflow-hidden text-left transition-all ${
        added ? 'ring-2 ring-clay-500' : 'hover:ring-1 hover:ring-paper-edge'
      }`}
    >
      <div className="relative h-36 w-full overflow-hidden">
        <CoverImage
          imageKey={`place:${place.id}`}
          fallbackKey={`city:${place.citySlug}`}
          query={`${place.name} ${place.neighborhood}`}
          alt={place.name}
          className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold shadow-sm transition-colors ${
            added ? 'bg-moss-500 text-white' : 'bg-paper/95 text-ink'
          }`}
        >
          {added ? '✓ Added' : '＋ Add'}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium leading-tight">{place.name}</h3>
          <span className="shrink-0 text-xs text-ink-mute">{dollars(place.priceLevel)}</span>
        </div>
        <p className="mt-0.5 text-xs text-ink-mute">{place.neighborhood}</p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{place.blurb}</p>
      </div>
    </button>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
        active ? 'border-clay-500 bg-clay-500 text-white' : 'border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400'
      }`}
    >
      {children}
    </button>
  )
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="h-7 w-7 rounded-full border border-paper-edge bg-paper-card text-ink-soft transition-colors hover:border-clay-400">−</button>
      <span className="w-5 text-center font-medium">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="h-7 w-7 rounded-full border border-paper-edge bg-paper-card text-ink-soft transition-colors hover:border-clay-400">＋</button>
    </div>
  )
}
