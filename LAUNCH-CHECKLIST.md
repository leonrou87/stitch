# Stitch — Launch Checklist

Live: **https://stitch.kytepush.com** · Repo: github.com/leonrou87/stitch · Vercel project `stitch`
(team `leonrou87s-projects`, auto-deploy on push to `main`).

Everything below is **live and working now**, except the items in "Needs your keys" — those are
wired in code and no-op gracefully until you add the key, so the site never breaks.

---

## ✅ Live and verified

**Core product**
- Curated trips (`/trips`, 42 themed trips across 14 cities) → open in the wizard at Review, adjust dates/picks, save.
- Build-your-own wizard (`/build/[city]`): Dates → Pace → Things to do → Food & drink → Stay & travel → Review → save.
- Multi-city trips (Tokyo+Kyoto, Paris+London, Amsterdam+Paris) — `/multi/[id]`, server-side save.
- Itinerary (`/i/[slug]`): hero, estimated budget (flights+stays+food), when-to-go, day-by-day timeline with per-stop maps + map-per-day, booking checklist (link out + tick "booked"), inline edit (change days/pace, remove stops, re-stitch in place), Email/Share/Print.
- SEO guides (`/guide/...`, ~30 cities × durations × niches) with embedded sample itineraries.
- My trips (`/me/trips`) — per-device list now; ties to account once Clerk is on.

**Trust / growth / ops**
- Newsletter capture (landing + footer → Supabase `subscribers`).
- Contact (`/contact` → Supabase `feedback`), Help (`/help`), legal (privacy/terms/affiliate-disclosure).
- Cookie consent + affiliate disclosure banner.
- Affiliate links on every bookable item, routed through `/r` (tracked), with FTC disclosure.
- Admin funnel dashboard at `/admin?key=…` (locked by `STITCH_ADMIN_KEY`).
- SEO: per-page titles/descriptions, canonicals, JSON-LD (FAQ / TouristDestination / TouristTrip), full `sitemap.xml`, `robots.txt`.
- Resilience: error boundary, loading skeletons, 404. Accessibility: skip link, landmarks, focus rings, aria labels, reduced-motion. Mobile hamburger nav + responsive QA.
- OG/social share images per trip + site default.

**Data / infra**
- Supabase (project KytePush): tables `itineraries`, `affiliate_clicks`, `feedback`, `subscribers`, `user_prefs`.
- Env already set in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `STITCH_ADMIN_KEY`.

---

## 🔑 Needs your keys (only you can create these accounts)

Add each to **Vercel → Project `stitch` → Settings → Environment Variables (Production)**, then redeploy
(or send me the values and I'll set them via the CLI). All are graceful no-ops until added.

| Feature | Env var(s) | Where to get it |
|---|---|---|
| **Accounts / login** (Google, Facebook, Apple, email) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | dashboard.clerk.com → create app. Enable providers in Clerk (Google works on dev instantly; Facebook/Apple need their own OAuth apps). Add `stitch.kytepush.com` to allowed origins for the production instance. |
| **Email** (contact forwarding + "email me this trip" + newsletter welcome) | `RESEND_API_KEY`, `RESEND_FROM`, `SUPPORT_FORWARD_EMAIL` | resend.com → API key + verify a sender domain (e.g. `hello@stitch.kytepush.com`). |
| **Analytics** (cookieless) | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=stitch.kytepush.com` | plausible.io → add the site. |
| **Nicer day maps** | `NEXT_PUBLIC_MAPBOX_TOKEN` | mapbox.com (optional; falls back to free OSM tiles). |
| **Affiliate revenue** | `TRAVELPAYOUTS_MARKER` (=740190, set), `BOOKING_AFFILIATE_ID`, `VIATOR_PARTNER_ID`, `GYG_PARTNER_ID`, `OPENTABLE_AFFILIATE_ID`, `AIRALO_AFFILIATE_ID`, `SAFETYWING_AFFILIATE_ID` | See `AFFILIATE-SETUP.md`. TravelPayouts (740190) is wired for Hotellook/Kiwi; the rest are direct-program signups. |

---

## 📋 Manual launch steps

1. **Affiliate approvals** — finish TravelPayouts + apply to Booking.com / Viator / GetYourGuide / OpenTable (see `AFFILIATE-SETUP.md`). Send IDs as they land.
2. **Search Console** — verify `stitch.kytepush.com` in Google Search Console + Bing Webmaster Tools; submit `https://stitch.kytepush.com/sitemap.xml`.
3. **Email** — add the Resend key + verified sender so contact/newsletter/"email me this trip" actually send.
4. **Analytics** — add the Plausible domain to start measuring the funnel.
5. **Accounts** — add Clerk keys + enable the OAuth providers you want.
6. **Legal** — the privacy/terms pages are solid templates; have them reviewed before scale.
7. **Socials** — secure the handles; the OG cards make shared links look good.

---

## 🩺 Operational notes

- **Deploy:** push to `main` → Vercel auto-deploys. A new subdomain stuck on TLS? `vercel certs issue <sub>.kytepush.com`.
- **DNS:** `*.kytepush.com` wildcard CNAME → `cname.vercel-dns.com` is at Porkbun, so new apps just attach the domain in Vercel.
- **Admin:** `https://stitch.kytepush.com/admin?key=<STITCH_ADMIN_KEY>` for the affiliate click funnel.
- **Persistence:** all data is in Supabase (project KytePush); the local JSON store is dev-only fallback.
