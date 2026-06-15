# Affiliate setup — how Stitch gets paid

Stitch makes money one way: affiliate commissions. We never take payment from travelers.
When someone follows a booking link and completes a purchase on the partner's site, the
partner pays us a cut. Nothing changes for the traveler.

This is the checklist to turn that on. The code is already wired — every link reads an ID
from an environment variable and, until you set it, falls back to a working plain search URL
(so links never break while approvals are pending). You just need accounts + IDs.

> These are accounts only you can open (they need your identity, tax info, and a bank
> account). I can't create them for you. Apply, then paste the IDs into `.env.local`.

## 1. Start with TravelPayouts (one signup, most of the inventory)

[travelpayouts.com](https://www.travelpayouts.com) is a meta-affiliate network: one
application gets you Aviasales/Kiwi (flights), Hotellook (hotels), DiscoverCars, Airalo,
GetYourGuide, Klook and more, with one dashboard and one payout. Fastest path to "earning".

- Sign up, get approved (usually same week).
- Copy your **marker** (your tracking ID).
- Set `TRAVELPAYOUTS_MARKER=` in `.env.local`. That alone activates Kiwi, Hotellook, and
  DiscoverCars links.

## 2. Direct programs (higher rates, apply in parallel)

| Partner | Apply at | Approval | Commission | Env var |
|---|---|---|---|---|
| Booking.com | partner.booking.com | 1–3 days | ~4% of stay | `BOOKING_AFFILIATE_ID` |
| Viator (Tripadvisor) | partner.viator.com | 5–10 days | ~8% | `VIATOR_PARTNER_ID` |
| GetYourGuide | partner.getyourguide.com | 3–7 days | ~8% | `GYG_PARTNER_ID` |
| OpenTable | opentable.com/affiliate | 2–5 days | ~$1 / seated cover | `OPENTABLE_AFFILIATE_ID` |
| SafetyWing | safetywing.com/affiliates | 1–3 days | ~10% | `SAFETYWING_AFFILIATE_ID` |
| Airalo (eSIM) | partners.airalo.com (or via TravelPayouts) | 2–5 days | ~$1–3 / eSIM | `AIRALO_AFFILIATE_ID` |
| Amazon Associates (gear) | affiliate-program.amazon.com | same day* | 1–10% | `AMAZON_ASSOCIATE_TAG` |

\* Amazon approves quickly but requires a few qualifying sales within 180 days to stay active.

## 3. Wire the IDs

```bash
cp .env.example .env.local   # if you haven't already
# paste each ID next to its variable, then restart the dev server
```

Each builder lives in `lib/affiliate/*.ts` and already appends the ID when present and omits
it (falling back to a plain partner search) when absent — so you can ship and add IDs as
approvals land. No code change needed.

## 4. Confirm it's tracking

- Every booking link on the site routes through `/r/[clickId]`, which records the click and
  302s to the partner. The local funnel is at **`/admin`** (clicks by provider).
- `/admin` is your internal sanity check. **Payouts are reported in each partner's own
  dashboard** — that's the source of truth for money. Click a few links, wait an hour, and
  confirm the clicks appear in TravelPayouts / Booking Partner Hub.

## 5. Stay compliant (already built, don't remove)

- **FTC disclosure**: the sticky banner + `/affiliate-disclosure` page are required by US
  law because we earn on links. Keep them.
- Links carry `rel="nofollow sponsored"` — correct for paid links and good SEO hygiene.
- Disclose near the buttons (the "affiliate links" note under each cluster does this).

## 6. Before deploying

- Lock down `/admin` (add auth) — it's an open operator page right now.
- Move the JSON click store to Postgres (`lib/db/schema.ts` has the `affiliate_clicks`
  table ready) so click data is durable and queryable across instances.
