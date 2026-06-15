'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const EXAMPLES = [
  '4 days in Tokyo for foodies',
  'Iceland ring road in 7 days',
  'Costa Rica with kids 6 and 9',
  'Solo in Lisbon for a long weekend',
  'Honeymoon in Italy, two weeks',
]

type Phase = 'idle' | 'streaming' | 'done' | 'error'

export function PlanClient() {
  const router = useRouter()
  const params = useSearchParams()
  const [value, setValue] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [stages, setStages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const started = useRef(false)

  // Prefill from ?q= and optionally auto-run from the landing page examples.
  useEffect(() => {
    const q = params.get('q')
    if (q && !started.current) {
      setValue(q)
      if (params.get('go') === '1') {
        started.current = true
        void run(q)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function run(message: string) {
    setPhase('streaming')
    setStages([])
    setError(null)

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong while building your trip. This is on us, not you.')
        setPhase('error')
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        buffer += decoder.decode(chunk, { stream: true })

        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''
        for (const block of events) {
          const evMatch = block.match(/^event: (.+)$/m)
          const dataMatch = block.match(/^data: (.+)$/m)
          if (!evMatch || !dataMatch) continue
          const ev = evMatch[1]
          const data = JSON.parse(dataMatch[1])

          if (ev === 'stage') setStages((s) => [...s, data.stage])
          if (ev === 'error') { setError(data.message); setPhase('error') }
          if (ev === 'complete') {
            setPhase('done')
            router.push(data.url)
          }
        }
      }
    } catch {
      setError('The connection dropped while building your trip. Try again.')
      setPhase('error')
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) void run(value.trim())
  }

  if (phase === 'streaming' || phase === 'done') {
    return (
      <div className="mx-auto max-w-prose py-10">
        <p className="font-serif text-2xl">Building your trip</p>
        <ul className="mt-6 space-y-3">
          {stages.map((s, i) => {
            const isLast = i === stages.length - 1 && phase === 'streaming'
            return (
              <li key={i} className="flex items-center gap-3 text-ink-soft">
                <span className={isLast ? 'h-2 w-2 animate-pulse rounded-full bg-clay-500' : 'text-moss-500'}>
                  {isLast ? '' : '✓'}
                </span>
                {s}{isLast ? '…' : ''}
              </li>
            )
          })}
        </ul>
        {phase === 'done' && <p className="mt-6 text-ink-mute">Your trip is ready. Taking you there.</p>}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-prose py-10">
      <h1 className="font-serif text-3xl">Tell me about your trip.</h1>
      <p className="mt-3 text-ink-soft">
        Where you want to go, how long, who&apos;s coming, what you&apos;re into. Be as vague or specific as you want.
      </p>

      <form onSubmit={submit} className="mt-6">
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e) }}
          rows={3}
          placeholder="e.g. 5 days in Lisbon for a couple who love food and slow mornings, mid budget"
          className="w-full resize-none rounded-2xl border border-paper-edge bg-paper-card p-4 text-ink shadow-card outline-none focus:border-clay-400"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-ink-mute">⌘+Enter to send</span>
          <button type="submit" disabled={!value.trim()} className="btn-clay disabled:opacity-40">
            Build my itinerary
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-clay-100 bg-clay-50 p-4 text-clay-700">{error}</div>
      )}

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Try one of these</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setValue(ex)} className="chip hover:border-clay-400 hover:text-ink">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
