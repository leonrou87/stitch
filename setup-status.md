# Setup status

Tracks what's ready, pending, and blocking. Update as accounts and keys land.

## Runs today (no credentials)

- [x] Next.js app scaffolded and running locally
- [x] Itinerary schema, prompts, tools, orchestrator (code pack, verbatim)
- [x] Offline itinerary generator (works with no API key)
- [x] 30-city destination seed loaded
- [x] Golden Tokyo itinerary embedded as showcase + few-shot reference
- [x] Planner with SSE streaming
- [x] Itinerary view rendering all sections
- [x] SEO guide pages (city / duration / niche) with embedded itineraries
- [x] Affiliate redirect + click tracking (JSON store)
- [x] FTC disclosure banner + page
- [x] Privacy / Terms / About
- [x] sitemap.xml + robots.txt

## Pending — needs Leon (ASK MODE)

| # | Item | State | Unblocks |
|---|------|-------|----------|
| 1 | Anthropic API key | not yet | live AI generation (offline generator works meanwhile) |
| 2 | Keep name "Stitch"? Domain? | assumed yes, no domain | branding, OG URLs |
| 3 | Supabase project (DATABASE_URL, keys) | not yet | durable Postgres storage |
| 4 | Clerk app (publishable + secret) | not yet | accounts, saved trips |
| 5 | TravelPayouts token + marker | not yet | flight/hotel/car/activity tracking |
| 6 | Booking.com Affiliate (AID) | not yet | hotel commissions |
| 7 | Viator / GetYourGuide / Klook / OpenTable IDs | not yet | activity + restaurant tracking |
| 8 | SafetyWing / Airalo affiliate IDs | not yet | insurance + eSIM tracking |
| 9 | Mapbox token | not yet | interactive maps |
| 10 | Unsplash access key | not yet | cached, attributed hero images |
| 11 | Sentry DSN / PostHog key | not yet | error + product analytics |
| 12 | GitHub repo + Vercel link | not yet | deploy pipeline |

All affiliate URL builders work without IDs (they omit the param and fall back to a plain
partner search URL), so links are functional before approvals come through.

## Decisions made (DECIDE MODE)

- Local JSON store instead of Postgres for the runnable v1; Drizzle schema kept as the
  production migration target.
- SEO sample itineraries generated deterministically at request time (no API cost).
- Default model `claude-sonnet-4-6`; override via `STITCH_MODEL`.
- Offline-safe system font stacks instead of `next/font` to avoid a network dependency.
