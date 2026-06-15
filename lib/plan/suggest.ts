// Suggestion engine. Given what's already picked, score the rest of a city's catalog and
// surface the few that best round out the trip. Deterministic — proximity, vibe match, and
// filling gaps (a daypart or category the trip is missing), not an LLM.
import type { Place } from '@/lib/data/catalog'
import { placesForCity } from '@/lib/data/catalog'

export interface Suggestion {
  place: Place
  reason: string
}

export function suggestPlaces(citySlug: string, selectedIds: string[], limit = 4): Suggestion[] {
  const all = placesForCity(citySlug)
  const selected = all.filter((p) => selectedIds.includes(p.id))
  const pool = all.filter((p) => !selectedIds.includes(p.id) && p.category !== 'stay')
  if (!selected.length) {
    // Cold start: lead with the classics.
    return pool
      .filter((p) => p.tags.includes('classic'))
      .slice(0, limit)
      .map((p) => ({ place: p, reason: 'A signature of the city' }))
  }

  const selHoods = new Set(selected.map((p) => p.neighborhood))
  const selCats = new Set(selected.map((p) => p.category))
  const selVibes = tally(selected.flatMap((p) => p.tags))
  const hasDinner = selected.some((p) => p.category === 'food' && p.dayparts.includes('evening'))
  const hasMorning = selected.some((p) => p.dayparts.includes('morning'))

  const scored = pool.map((p) => {
    let score = 0
    const reasons: string[] = []
    if (selHoods.has(p.neighborhood)) { score += 3; reasons.push(`Walkable from your ${p.neighborhood} picks`) }
    const vibeOverlap = p.tags.reduce((s, t) => s + (selVibes.get(t) ?? 0), 0)
    score += vibeOverlap
    if (!selCats.has(p.category)) { score += 2; reasons.push(`Adds a ${p.category} to the mix`) }
    if (!hasDinner && p.category === 'food' && p.dayparts.includes('evening')) { score += 4; reasons.push('You have no dinner yet') }
    if (!hasMorning && p.dayparts.includes('morning')) { score += 2; reasons.push('A morning start to balance the days') }
    if (p.tags.includes('classic')) score += 1
    return { place: p, score, reason: reasons[0] ?? matchReason(p, selVibes) }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map(({ place, reason }) => ({ place, reason }))
}

function matchReason(p: Place, selVibes: Map<string, number>): string {
  const top = p.tags.find((t) => selVibes.has(t))
  return top ? `More of the ${top} you're after` : 'Rounds out the trip'
}

function tally(arr: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1)
  return m
}
