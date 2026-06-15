import type { MetadataRoute } from 'next'
import { destinations } from '@/lib/data/destinations'
import { DURATIONS, nicheSlugs } from '@/lib/seo/guide'
import { listItineraries } from '@/lib/db/store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const now = new Date()

  const staticPages = ['', '/plan', '/guide', '/about', '/affiliate-disclosure', '/privacy', '/terms'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
  }))

  const guidePages = destinations.flatMap((d) => [
    { url: `${base}/guide/${d.slug}`, lastModified: now },
    ...DURATIONS.map((n) => ({ url: `${base}/guide/${d.slug}/${n}-day-itinerary`, lastModified: now })),
    ...nicheSlugs.map((s) => ({ url: `${base}/guide/${d.slug}/${s}`, lastModified: now })),
  ])

  const userItineraries = (await listItineraries({ limit: 1000 })).map((r) => ({
    url: `${base}/i/${r.slug}`,
    lastModified: new Date(r.generatedAt),
  }))

  return [...staticPages, ...guidePages, ...userItineraries]
}
