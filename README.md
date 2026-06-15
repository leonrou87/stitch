# Stitch

Pick the real places you actually want; Stitch arranges them into a coherent day-by-day
trip. The product is **data-first and light on AI**: a curated catalog of real, named
places, a flight lookup, and a deterministic engine that clusters your picks by
neighborhood, paces them, and drops lunch and dinner into the right slots. Every place
links straight to a booking partner through a tracked redirect.

Built from the spec, code pack, content pack, launch pack, and quality pack in `TRAVEL.zip`,
then pivoted to a browse-and-stitch model.

## Run it

```bash
cd ~/Desktop/Stitch
npm install
npm run dev
# open http://localhost:3000
```

No database, no API keys, no cloud accounts. It runs out of the box.

## The flow

1. **Pick a city** (`/build`) — six cities with curated catalogs to start.
2. **Add places** (`/build/[city]`) — browse real, named restaurants, bars, sights,
   galleries, markets, and outdoors. Filter by category or neighborhood. Tap to add.
3. **Watch it stitch** — the tray shows a live day-by-day preview as you add. Set days and
   pace; add an origin airport for a flight estimate. The suggestion rail proposes what
   rounds out the trip (proximity, vibe match, a missing dinner).
4. **Save & view** — persists a real itinerary at `/i/[slug]`, fully rendered, every booking
   link tracked through `/r/[clickId]`.

## Where the cleverness lives (not the LLM)

- **`lib/data/catalog.ts`** — the spine. Real, verifiable places with neighborhood, price,
  duration, daypart, and an honest one-line take. Adding a city is a data edit, not a model
  change.
- **`lib/plan/stitch.ts`** — pure, deterministic arranger. Clusters picks by neighborhood
  to minimize hopping, buckets each place into its daypart, anchors meals, paces the day,
  and emits the canonical `Itinerary`. No AI.
- **`lib/plan/suggest.ts`** — deterministic "you might add" scoring: proximity to current
  picks, vibe overlap, category gaps, and filling an empty dinner/morning.
- **`lib/flights/estimate.ts`** — flight lookup behind a `FlightProvider` interface. v1 is a
  great-circle estimator + live Kiwi/Booking links; drop a real API into `LIVE_PROVIDER`
  later and nothing else changes.

AI is optional, not load-bearing. The original Claude orchestrator (tool-use, streaming,
schema-validated) still lives in `lib/ai/` and powers the legacy `/plan` free-text route
when `ANTHROPIC_API_KEY` is set — useful for a "describe it and we'll start you off" mode.

## Also built

- **SEO guides** (`/guide`, `/guide/[city]`, `/guide/[city]/[N]-day-itinerary`,
  `/guide/[city]/[niche]`) — 30 cities, ~360 pages, embedded sample itineraries, `TouristTrip`
  structured data.
- **Affiliate tracking** (`/r/[clickId]`), **FTC disclosure**, **legal** pages, dynamic
  `sitemap.xml` + `robots.txt`.

## Architecture notes

Local JSON store (`lib/db/store.ts`) instead of Postgres so it runs with zero setup; the
production Drizzle schema is kept verbatim in `lib/db/schema.ts` as the migration target.
Clerk/Mapbox/Sentry/PostHog are not wired (env seams in place). See `setup-status.md`.

## Next steps

1. Grow the catalog — more cities, more places per city. Pure data.
2. Wire a real flight API into `LIVE_PROVIDER` once a TravelPayouts token lands.
3. Postgres + Drizzle; Clerk auth for saved trips; Mapbox to plot the day on a map.
4. Real affiliate IDs in `.env.local` (links already work without them).
