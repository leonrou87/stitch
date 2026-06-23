'use client'

import { useEffect, useState } from 'react'

const PACES = ['slow', 'moderate', 'packed'] as const
const DIETARY = ['vegetarian', 'vegan', 'gluten-free', 'pescatarian', 'halal', 'kosher', 'nut allergy']

// Edits the signed-in user's travel defaults. Home airport prefills the flight estimate in
// the planner; pace sets the wizard's starting pace.
export function SettingsForm() {
  const [homeAirport, setHomeAirport] = useState('')
  const [pace, setPace] = useState<string>('')
  const [dietary, setDietary] = useState<string[]>([])
  const [state, setState] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/me/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.prefs) {
          setHomeAirport(d.prefs.homeAirport ?? '')
          setPace(d.prefs.defaultPace ?? '')
          setDietary(d.prefs.dietary ?? [])
        }
        setState('idle')
      })
      .catch(() => setState('idle'))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setState('saving')
    try {
      const res = await fetch('/api/me/settings', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeAirport, defaultPace: pace || null, dietary }),
      })
      setState(res.ok ? 'saved' : 'error')
      if (res.ok) setTimeout(() => setState('idle'), 2000)
    } catch { setState('error') }
  }

  if (state === 'loading') return <p className="mt-6 text-ink-mute">Loading your settings…</p>

  return (
    <form onSubmit={save} className="card mt-6 max-w-lg space-y-6 p-6">
      <label className="block">
        <span className="text-sm font-medium text-ink-soft">Home airport</span>
        <p className="text-xs text-ink-mute">Used to pre-fill flight estimates (e.g. SFO, LHR).</p>
        <input value={homeAirport} onChange={(e) => setHomeAirport(e.target.value.toUpperCase())} placeholder="SFO" maxLength={4}
          className="mt-1.5 w-32 rounded-xl border border-paper-edge bg-paper-card px-3 py-2 text-sm outline-none focus:border-clay-400" />
      </label>

      <div>
        <span className="text-sm font-medium text-ink-soft">Default pace</span>
        <div className="mt-1.5 flex gap-1.5">
          {PACES.map((p) => (
            <button type="button" key={p} onClick={() => setPace(pace === p ? '' : p)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${pace === p ? 'border-clay-500 bg-clay-500 text-white' : 'border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-sm font-medium text-ink-soft">Dietary</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {DIETARY.map((d) => {
            const on = dietary.includes(d)
            return (
              <button type="button" key={d} onClick={() => setDietary((s) => on ? s.filter((x) => x !== d) : [...s, d])}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${on ? 'border-moss-500 bg-moss-500 text-white' : 'border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400'}`}>
                {d}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={state === 'saving'} className="btn-clay disabled:opacity-50">
          {state === 'saving' ? 'Saving…' : 'Save settings'}
        </button>
        {state === 'saved' && <span className="text-sm text-moss-600">Saved</span>}
        {state === 'error' && <span className="text-sm text-clay-600">Couldn’t save. Try again.</span>}
      </div>
    </form>
  )
}
