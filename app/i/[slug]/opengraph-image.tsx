import { ImageResponse } from 'next/og'
import { getItineraryBySlug } from '@/lib/db/store'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'A trip planned on Stitch'

// Social-share card for a shared trip link. Rendered on demand from the saved itinerary.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const rec = await getItineraryBySlug(slug).catch(() => undefined)
  const it = rec?.data
  const title = it ? `${it.dates.durationDays} days in ${it.destination.primaryCity}` : 'A trip on Stitch'
  const summary = it?.summary ? truncate(it.summary, 170) : 'Real places, stitched into a trip you can book.'
  const tags = it?.preferences.vibeTags?.slice(0, 4) ?? []

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 72, background: '#faf7f0', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 26, height: 26, background: '#c66f3e', transform: 'rotate(45deg)', borderRadius: 5 }} />
          <span style={{ color: '#1a1a17' }}>Stitch</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 78, fontWeight: 700, color: '#1a1a17', lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontSize: 30, color: '#3a3a34', lineHeight: 1.35, maxWidth: 1000 }}>{summary}</div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              {tags.map((t) => (
                <span key={t} style={{ fontSize: 22, color: '#a9572c', background: '#f5e2d6', padding: '6px 16px', borderRadius: 999 }}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 26, color: '#6b6a60' }}>stitch.kytepush.com</div>
      </div>
    ),
    { ...size },
  )
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s
}
