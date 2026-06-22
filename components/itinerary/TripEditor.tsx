'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface EditorDay { dayNumber: number; title: string; activities: { title: string }[] }

// Inline "Customize" panel on a saved trip. Change length/pace (re-stitched server-side from
// the trip's source picks) or remove a stop — all in place on the same URL, then refresh.
export function TripEditor({
  slug, citySlug, placeIds, days, pace, hasSource, editorDays,
}: {
  slug: string
  citySlug?: string
  placeIds: string[]
  days: number
  pace: 'slow' | 'moderate' | 'packed'
  hasSource: boolean
  editorDays: EditorDay[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function patch(payload: Record<string, unknown>) {
    setBusy(true); setError(null)
    try {
      const res = await fetch(`/api/itineraries/${slug}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const d = await res.json().catch(() => ({}))
      if (res.ok) { router.refresh() }
      else { setError(d.error || "That didn't work. Try again."); }
    } catch { setError('Connection dropped. Try again.') }
    finally { setBusy(false) }
  }

  if (!open) {
    return (
      <div className="mt-4">
        <button onClick={() => setOpen(true)} className="btn-ghost text-sm">Customize this trip</button>
      </div>
    )
  }

  return (
    <div className="card mt-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl">Customize</h3>
        <button onClick={() => setOpen(false)} className="text-sm text-ink-mute hover:text-ink">Done</button>
      </div>

      {hasSource ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink-soft">Length</span>
            <div className="flex items-center gap-3">
              <button disabled={busy || days <= 1} onClick={() => patch({ op: 'setDays', days: days - 1 })} className="h-8 w-8 rounded-full border border-paper-edge bg-paper-card hover:border-clay-400 disabled:opacity-40">−</button>
              <span className="w-16 text-center text-sm">{days} day{days === 1 ? '' : 's'}</span>
              <button disabled={busy || days >= 14} onClick={() => patch({ op: 'setDays', days: days + 1 })} className="h-8 w-8 rounded-full border border-paper-edge bg-paper-card hover:border-clay-400 disabled:opacity-40">＋</button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-ink-soft">Pace</span>
            <div className="flex gap-1">
              {(['slow', 'moderate', 'packed'] as const).map((p) => (
                <button key={p} disabled={busy} onClick={() => patch({ op: 'setPace', pace: p })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${p === pace ? 'border-clay-500 bg-clay-500 text-white' : 'border-paper-edge bg-paper-card text-ink-soft hover:border-clay-400'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {citySlug && (
            <Link
              href={`/build/${citySlug}?add=${placeIds.join(',')}&days=${days}&pace=${pace}&step=do`}
              className="inline-block text-sm text-clay-600 hover:underline"
            >
              Add or swap places →
            </Link>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-mute">
          This trip predates in-place editing. You can still remove stops below, or rebuild it in the planner.
        </p>
      )}

      <div className="mt-5 border-t border-paper-edge pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Remove a stop</p>
        <div className="mt-2 space-y-3">
          {editorDays.map((d) => (
            <div key={d.dayNumber}>
              <p className="text-sm font-medium">Day {d.dayNumber} · {d.title}</p>
              <ul className="mt-1 space-y-1">
                {d.activities.map((a, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 text-sm text-ink-soft">
                    <span className="truncate">{a.title}</span>
                    <button disabled={busy} onClick={() => patch({ op: 'removeActivity', dayNumber: d.dayNumber, index: i })}
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs text-ink-mute hover:bg-paper hover:text-clay-600 disabled:opacity-40">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-clay-600">{error}</p>}
      {busy && <p className="mt-3 text-sm text-ink-mute">Updating…</p>}
    </div>
  )
}
