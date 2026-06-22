'use client'

import { useState } from 'react'

export interface MapPoint { lat: number; lng: number; name: string }

// A small static map of a day's stops. Uses Mapbox when NEXT_PUBLIC_MAPBOX_TOKEN is set
// (nicest), else a keyless OpenStreetMap static image; the image hides itself if it fails
// to load, and there's always a "open in Google Maps" route link so the feature is useful
// regardless.
function googleDirections(points: MapPoint[]): string {
  if (points.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${points[0].lat},${points[0].lng}`
  }
  const coord = (p: MapPoint) => `${p.lat},${p.lng}`
  const origin = coord(points[0])
  const destination = coord(points[points.length - 1])
  const waypoints = points.slice(1, -1).map(coord).join('|')
  const wp = waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${wp}&travelmode=walking`
}

function mapImageUrl(points: MapPoint[]): string {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (token) {
    const markers = points
      .map((p, i) => `pin-s-${i + 1}+c66f3e(${p.lng.toFixed(5)},${p.lat.toFixed(5)})`)
      .join(',')
    return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${markers}/auto/640x280@2x?padding=50&access_token=${token}`
  }
  // Keyless OSM fallback.
  const lat = avg(points.map((p) => p.lat))
  const lng = avg(points.map((p) => p.lng))
  const markers = points.map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)},red`).join('|')
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat.toFixed(5)},${lng.toFixed(5)}&zoom=13&size=640x280&maptype=mapnik&markers=${markers}`
}

export function DayMap({ points }: { points: MapPoint[] }) {
  const [failed, setFailed] = useState(false)
  if (!points.length) return null

  return (
    <div className="mb-7 overflow-hidden rounded-xl border border-paper-edge">
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mapImageUrl(points)}
          alt={`Map of the day's stops`}
          className="h-44 w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <a
        href={googleDirections(points)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-paper-card px-4 py-2.5 text-sm text-clay-600 hover:bg-paper"
      >
        <span>{points.length} stop{points.length === 1 ? '' : 's'} on the map</span>
        <span>Open the day in Google Maps ↗</span>
      </a>
    </div>
  )
}

function avg(ns: number[]): number {
  return ns.reduce((s, n) => s + n, 0) / ns.length
}
