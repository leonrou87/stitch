'use client'

import { useState } from 'react'
import { imageMap } from '@/lib/data/images'

// Accurate cover image. Resolution order:
//   1. baked real photo for imageKey (e.g. place:bcn-sagrada) — from Wikipedia
//   2. baked real photo for fallbackKey (e.g. city:barcelona) — accurate to the destination
//   3. topical keyword photo (loremflickr) for anything with no baked match
//   4. warm gradient if even that fails to load — never a broken icon
// Production: wire the Unsplash API (UNSPLASH_ACCESS_KEY) for hand-picked, attributed photos.
function loremflickr(query: string): string {
  let h = 0
  for (let i = 0; i < query.length; i++) h = (h * 31 + query.charCodeAt(i)) >>> 0
  return `https://loremflickr.com/1280/800/${encodeURIComponent(query.replace(/\s+/g, ','))}?lock=${h % 1000}`
}

export function CoverImage({
  imageKey,
  fallbackKey,
  query = 'travel',
  alt,
  className = '',
  priority = false,
}: {
  imageKey?: string
  fallbackKey?: string
  query?: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const resolved =
    (imageKey && imageMap[imageKey]) ||
    (fallbackKey && imageMap[fallbackKey]) ||
    loremflickr(query)

  const [src, setSrc] = useState(resolved)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <div className={`${className} bg-gradient-to-br from-clay-100 via-paper to-clay-50`} aria-label={alt} role="img" />
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${className} object-cover`}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => {
        // If a baked image fails, drop to a topical photo before giving up.
        if (src !== loremflickr(query)) setSrc(loremflickr(query))
        else setFailed(true)
      }}
    />
  )
}
