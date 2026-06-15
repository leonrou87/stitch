// Persistence. Uses Supabase when configured (production), else a local JSON file store
// (zero-setup local dev). All reads/writes are async. Affiliate redirects are STATELESS:
// wrapAffiliate encodes the target into the /r URL (no DB write during render), and the
// click is logged best-effort when /r is hit — serverless-safe and render-fast.
import fs from 'node:fs'
import path from 'node:path'
import type { Itinerary } from '@/lib/types/itinerary'
import { getSupabase } from './supabase'

const DATA_DIR = path.join(process.cwd(), '.data')
const ITIN_FILE = path.join(DATA_DIR, 'itineraries.json')
const CLICK_FILE = path.join(DATA_DIR, 'clicks.json')

export interface ItineraryRecord {
  id: string
  slug: string
  isSeoPage: boolean
  data: Itinerary
  destinationCity: string
  destinationCountry: string
  durationDays: number
  travelersCount: number
  vibeTags: string[]
  viewCount: number
  generatedAt: string
}

// ---------- JSON fallback helpers ----------
function readJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T
  } catch {
    return fallback
  }
}
function writeJson(file: string, data: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}
function rowToRecord(r: Record<string, unknown>): ItineraryRecord {
  return {
    id: String(r.id),
    slug: String(r.slug),
    isSeoPage: Boolean(r.is_seo_page),
    data: r.data as Itinerary,
    destinationCity: String(r.destination_city ?? ''),
    destinationCountry: String(r.destination_country ?? ''),
    durationDays: Number(r.duration_days ?? 0),
    travelersCount: Number(r.travelers_count ?? 0),
    vibeTags: (r.vibe_tags as string[]) ?? [],
    viewCount: Number(r.view_count ?? 0),
    generatedAt: String(r.created_at ?? new Date().toISOString()),
  }
}

// ---------- Itineraries ----------
export async function saveItinerary(input: {
  slug: string
  data: Itinerary
  isSeoPage?: boolean
}): Promise<ItineraryRecord> {
  const it = input.data
  const base = {
    slug: input.slug,
    data: it,
    destination_city: it.destination.primaryCity,
    destination_country: it.destination.country,
    duration_days: it.dates.durationDays,
    travelers_count: it.travelers.adults + it.travelers.children.length,
    vibe_tags: it.preferences.vibeTags,
    is_seo_page: input.isSeoPage ?? false,
  }

  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('itineraries').insert(base).select().single()
    if (error) throw new Error(`saveItinerary: ${error.message}`)
    return rowToRecord(data)
  }

  // local JSON
  const all = readJson<Record<string, unknown>[]>(ITIN_FILE, [])
  const rec = { id: cryptoId(), created_at: new Date().toISOString(), view_count: 0, ...base }
  all.push(rec)
  writeJson(ITIN_FILE, all)
  return rowToRecord(rec)
}

export async function getItineraryBySlug(slug: string): Promise<ItineraryRecord | undefined> {
  const sb = getSupabase()
  if (sb) {
    const { data, error } = await sb.from('itineraries').select('*').eq('slug', slug).maybeSingle()
    if (error || !data) return undefined
    return rowToRecord(data)
  }
  const all = readJson<Record<string, unknown>[]>(ITIN_FILE, [])
  const r = all.find((x) => x.slug === slug)
  return r ? rowToRecord(r) : undefined
}

export async function listItineraries(opts: { seoOnly?: boolean; limit?: number } = {}): Promise<ItineraryRecord[]> {
  const sb = getSupabase()
  if (sb) {
    let q = sb.from('itineraries').select('*').order('created_at', { ascending: false })
    if (opts.seoOnly !== undefined) q = q.eq('is_seo_page', opts.seoOnly)
    if (opts.limit) q = q.limit(opts.limit)
    const { data } = await q
    return (data ?? []).map(rowToRecord)
  }
  let all = readJson<Record<string, unknown>[]>(ITIN_FILE, []).map(rowToRecord)
  if (opts.seoOnly !== undefined) all = all.filter((r) => r.isSeoPage === opts.seoOnly)
  all.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
  return opts.limit ? all.slice(0, opts.limit) : all
}

export async function incrementView(slug: string): Promise<void> {
  const sb = getSupabase()
  if (sb) {
    // best-effort; ignore failures
    const { data } = await sb.from('itineraries').select('view_count').eq('slug', slug).maybeSingle()
    if (data) await sb.from('itineraries').update({ view_count: (data.view_count ?? 0) + 1 }).eq('slug', slug)
    return
  }
  const all = readJson<Record<string, unknown>[]>(ITIN_FILE, [])
  const r = all.find((x) => x.slug === slug)
  if (r) { r.view_count = Number(r.view_count ?? 0) + 1; writeJson(ITIN_FILE, all) }
}

// ---------- Affiliate redirect (stateless) ----------
const PARTNER_HOSTS = [
  'booking.com', 'flights.booking.com', 'kiwi.com', 'hotellook.com', 'search.hotellook.com',
  'viator.com', 'getyourguide.com', 'opentable.com', 'airalo.com', 'safetywing.com',
  'discovercars.com', 'amazon.com',
]

export function isAllowedAffiliateHost(rawUrl: string): boolean {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, '')
    return PARTNER_HOSTS.some((h) => host === h || host.endsWith('.' + h) || host === h.replace(/^.*\./, ''))
  } catch {
    return false
  }
}

// Pure: no DB write. Encodes the target + metadata into a stateless /r link.
export function wrapAffiliate(params: {
  itineraryId: string | null
  provider: string
  kind: string
  targetUrl: string
}): string {
  const q = new URLSearchParams({
    u: params.targetUrl,
    p: params.provider,
    k: params.kind,
  })
  if (params.itineraryId) q.set('i', params.itineraryId)
  return `/r?${q.toString()}`
}

export async function logClick(params: {
  itineraryId: string | null
  provider: string
  kind: string
  targetUrl: string
}): Promise<void> {
  const sb = getSupabase()
  if (sb) {
    await sb.from('affiliate_clicks').insert({
      itinerary_id: params.itineraryId,
      provider: params.provider,
      link_kind: params.kind,
      link_target_url: params.targetUrl,
    })
    return
  }
  const all = readJson<Record<string, unknown>[]>(CLICK_FILE, [])
  all.push({ id: cryptoId(), itinerary_id: params.itineraryId, provider: params.provider, link_kind: params.kind, link_target_url: params.targetUrl, created_at: new Date().toISOString() })
  writeJson(CLICK_FILE, all)
}

export interface ProviderStat { provider: string; clicks: number }

export async function clickStatsByProvider(): Promise<{ byProvider: ProviderStat[]; totalClicks: number }> {
  const sb = getSupabase()
  let rows: { provider: string }[] = []
  if (sb) {
    const { data } = await sb.from('affiliate_clicks').select('provider')
    rows = (data ?? []) as { provider: string }[]
  } else {
    rows = readJson<{ provider: string }[]>(CLICK_FILE, [])
  }
  const map = new Map<string, number>()
  for (const r of rows) map.set(r.provider, (map.get(r.provider) ?? 0) + 1)
  const byProvider = [...map.entries()].map(([provider, clicks]) => ({ provider, clicks })).sort((a, b) => b.clicks - a.clicks)
  return { byProvider, totalClicks: rows.length }
}

function cryptoId(): string {
  return 'xxxxxxxx-xxxx-4xxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16))
}
