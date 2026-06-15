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
const CAT_ICON: Record<PlaceCategory, string> = {
  cafe: '☕', food: '🍽', bar: '🍸', sight: '📸', gallery: '🖼', experience: '✨',
  outdoor: '⛰', shop: '🛍', market: '🧺', stay: '🛏',
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
  const [saving, setSaving] = useState(false)

  const [autoGo, setAutoGo] = useState(false)

  // Deep-link preselection: /build/[city]?add=id1,id2 — shareable build links.
  // ?go=1 also runs the stitch+save end-to-end and redirects to the saved trip.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const ids = sp.get('add')
    if (ids) {
      const valid = ids.split(',').filter((id) => all.some((p) => p.id === id))
      if (valid.length) setSelected(valid)
      if (sp.get('go') === '1') setAutoGo(true)
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
  const suggestions = useMemo(() => suggestPlaces(citySlug, selected, 4), [citySlug, selected])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  // Fire the real stitch+save once a ?go=1 deep link has its picks loaded.
  useEffect(() => {
    if (autoGo && preview && !saving) { setAutoGo(false); void save() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGo, preview])

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
    if (!preview) return
    setSaving(true)
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: preview }),
      })
      const data = await res.json()
      if (data.url) router.push(data.url)
      else setSaving(false)
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="container-wide py-8">
      <div className="mb-6">
        <h1 className="font-serif text-3xl">Build your {cityName} trip</h1>
        <p className="mt-1 text-ink-soft">
          Pick the places you actually want. We&apos;ll stitch them into days — clustered by
          neighborhood, paced, lunch and dinner in the right slots.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Catalog */}
        <div>
          <div className="sticky top-16 z-10 -mx-1 mb-4 bg-paper/80 px-1 py-2 backdrop-blur">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cityName}…`}
              className="mb-3 w-full rounded-full border border-paper-edge bg-paper-card px-4 py-2 text-sm outline-none focus:border-clay-400"
            />
            <div className="flex flex-wrap gap-1.5">
              <FilterChip active={cat === 'all'} onClick={() => setCat('all')}>All</FilterChip>
              {categories.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
                  {CAT_ICON[c]} {CAT_LABEL[c]}
                </FilterChip>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <FilterChip active={hood === 'all'} onClick={() => setHood('all')}>All areas</FilterChip>
              {neighborhoods.map((n) => (
                <FilterChip key={n} active={hood === n} onClick={() => setHood(n)}>{n}</FilterChip>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((p) => (
              <PlaceCard key={p.id} place={p} added={selected.includes(p.id)} onToggle={() => toggle(p.id)} />
            ))}
            {filtered.length === 0 && <p className="text-ink-mute">Nothing matches those filters.</p>}
          </div>
        </div>

        {/* Tray */}
        <aside className="lg:sticky lg:top-16 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:pb-8">
          <div className="card p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl">Your trip</h2>
              <span className="text-sm text-ink-mute">{selected.length} place{selected.length === 1 ? '' : 's'}</span>
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Days</span>
                <Stepper value={duration} min={1} max={10} onChange={setDuration} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Pace</span>
                <div className="flex gap-1">
                  {(['slow', 'moderate', 'packed'] as const).map((p) => (
                    <FilterChip key={p} active={pace === p} onClick={() => setPace(p)}>{p}</FilterChip>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex gap-2">
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    placeholder="From (e.g. SFO)"
                    className="w-full rounded-full border border-paper-edge bg-paper px-3 py-1.5 text-sm outline-none focus:border-clay-400"
                  />
                  <button onClick={getFlights} className="btn-ghost shrink-0 px-3 py-1.5 text-sm">Flights</button>
                </div>
                {flightMsg && <p className="mt-1 text-xs text-ink-mute">{flightMsg}</p>}
                {flights.map((f, i) => (
                  <div key={i} className="mt-2 rounded-lg bg-paper p-2 text-xs text-ink-soft">
                    <span className="font-medium">{f.outbound.from} → {f.outbound.to}</span> · ~${f.estimatedPriceUsd.toLocaleString()} rt · {f.outbound.durationHours}h
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-5 border-t border-paper-edge pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">You might add</p>
                <div className="mt-2 space-y-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s.place.id}
                      onClick={() => toggle(s.place.id)}
                      className="flex w-full items-start gap-2 rounded-lg border border-paper-edge bg-paper-card p-2 text-left text-sm hover:border-clay-400"
                    >
                      <span className="text-clay-500">＋</span>
                      <span>
                        <span className="font-medium">{s.place.name}</span>
                        <span className="block text-xs text-ink-mute">{s.reason}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={save}
              disabled={!preview || saving}
              className="btn-clay mt-5 w-full disabled:opacity-40"
            >
              {saving ? 'Stitching…' : selected.length ? 'Stitch & view trip ▸' : 'Pick a few places first'}
            </button>
          </div>

          {/* Live day preview */}
          {preview && (
            <div className="card mt-4 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Preview · {preview.dates.durationDays} days</p>
              <div className="mt-3 space-y-4">
                {preview.days.map((d) => (
                  <div key={d.dayNumber}>
                    <p className="font-medium">Day {d.dayNumber}: {d.title}</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-ink-soft">
                      {d.activities.map((a, i) => (
                        <li key={i}><span className="font-mono text-xs text-clay-600">{a.time}</span> {a.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

function PlaceCard({ place, added, onToggle }: { place: Place; added: boolean; onToggle: () => void }) {
  return (
    <div className={`card flex flex-col overflow-hidden transition-colors ${added ? 'ring-2 ring-clay-400' : ''}`}>
      <div className="relative h-32 w-full overflow-hidden">
        <CoverImage
          imageKey={`place:${place.id}`}
          fallbackKey={`city:${place.citySlug}`}
          query={`${place.name} ${place.neighborhood}`}
          alt={place.name}
          className="absolute inset-0 h-full w-full"
        />
        <span className="absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
          {CAT_ICON[place.category]} {place.neighborhood}
        </span>
        <button
          onClick={onToggle}
          className={`absolute right-2 top-2 ${added ? 'btn px-3 py-1 text-xs bg-moss-500 text-white' : 'btn px-3 py-1 text-xs bg-paper/95 text-ink hover:bg-white'}`}
        >
          {added ? 'Added ✓' : 'Add'}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-medium leading-tight">{place.name}</h3>
          <span className="text-xs text-ink-mute">{dollars(place.priceLevel)}</span>
        </div>
        <p className="mt-2 line-clamp-3 text-sm text-ink-soft">{place.blurb}</p>
        {place.order && <p className="mt-1 text-xs text-ink-mute"><span className="font-medium">Order:</span> {place.order}</p>}
      </div>
    </div>
  )
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
      <button onClick={() => onChange(Math.max(min, value - 1))} className="h-7 w-7 rounded-full border border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400">−</button>
      <span className="w-5 text-center font-medium">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="h-7 w-7 rounded-full border border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400">＋</button>
    </div>
  )
}
