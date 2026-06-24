import type { MetadataRoute } from 'next'
import { destinations } from '@/lib/data/destinations'
import { catalogCitySlugs } from '@/lib/data/catalog'
import { DURATIONS, nicheSlugs } from '@/lib/seo/guide'
import { listItineraries } from '@/lib/db/store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const now = new Date()

  const staticPages = ['', '/trips', '/build', '/guide', '/about', '/help', '/contact', '/affiliate-disclosure', '/privacy', '/terms']
    .map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 }))

  const buildPages = catalogCitySlugs.map((slug) => ({
    url: `${base}/build/${slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.6,
  }))

  const guidePages = destinations.flatMap((d) => [
    { url: `${base}/guide/${d.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 },
    ...DURATIONS.map((n) => ({ url: `${base}/guide/${d.slug}/${n}-day-itinerary`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
    ...nicheSlugs.map((s) => ({ url: `${base}/guide/${d.slug}/${s}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ])

  const userItineraries = (await listItineraries({ limit: 1000 })).map((r) => ({
    url: `${base}/i/${r.slug}`, lastModified: new Date(r.generatedAt), changeFrequency: 'monthly' as const, priority: 0.4,
  }))

  return [...staticPages, ...buildPages, ...guidePages, ...userItineraries]
}
