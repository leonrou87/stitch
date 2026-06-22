import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Stitch — a trip you can book in an afternoon'

// Default social card for the site (home + any page without its own OG image).
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 80, background: '#faf7f0', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 700 }}>
          <div style={{ width: 28, height: 28, background: '#c66f3e', transform: 'rotate(45deg)', borderRadius: 5 }} />
          <span style={{ color: '#1a1a17' }}>Stitch</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 700, color: '#1a1a17', lineHeight: 1.03, letterSpacing: -1.5 }}>
            A trip you can book in an afternoon.
          </div>
          <div style={{ fontSize: 32, color: '#3a3a34', maxWidth: 980 }}>
            Pick a curated trip or build your own from real places. Free, no signup.
          </div>
        </div>
        <div style={{ fontSize: 26, color: '#6b6a60' }}>stitch.kytepush.com</div>
      </div>
    ),
    { ...size },
  )
}
