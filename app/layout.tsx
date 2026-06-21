import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { DisclosureBanner } from '@/components/layout/DisclosureBanner'

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Stitch — Plan a trip that’s actually yours',
    template: '%s · Stitch',
  },
  description:
    'Tell us where you want to go. We build a day-by-day itinerary with real places, real prices, and one-click bookings. Free, no signup.',
  openGraph: {
    title: 'Stitch',
    description: 'Plan a trip that’s actually yours.',
    type: 'website',
    url: appUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* TravelPayouts site verification + tracking (project 540243). Rendered in the
            server HTML head so their verifier detects it. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () { var script = document.createElement("script"); script.async = 1; script.src = 'https://emrldco.com/NTQwMjQz.js?t=540243'; document.head.appendChild(script); })();`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <DisclosureBanner />
              <script defer src="https://kytepush.com/track.js"></script>
      </body>
    </html>
  )
}
