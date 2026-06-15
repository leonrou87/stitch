// Production Postgres schema (Drizzle) per the spec. The running app uses the local
// JSON store in store.ts so it needs no database; this is the target schema for when
// you wire Supabase/Postgres (set DATABASE_URL and run `drizzle-kit generate && push`).
import { pgTable, uuid, text, boolean, integer, numeric, timestamp, jsonb, index } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  defaultHomeAirport: text('default_home_airport'),
  preferences: jsonb('preferences').$type<{
    vibeTags?: string[]
    pace?: string
    dietary?: string[]
    budgetTier?: string
  }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const itineraries = pgTable('itineraries', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),
  isPublic: boolean('is_public').default(true).notNull(),
  isSeoPage: boolean('is_seo_page').default(false).notNull(),
  data: jsonb('data').notNull(), // ItinerarySchema
  destinationCity: text('destination_city').notNull(),
  destinationCountry: text('destination_country').notNull(),
  durationDays: integer('duration_days').notNull(),
  travelersCount: integer('travelers_count').notNull(),
  vibeTags: text('vibe_tags').array().default([]),
  viewCount: integer('view_count').default(0).notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  destinationIdx: index('itineraries_destination_idx').on(table.destinationCity, table.destinationCountry),
  ownerIdx: index('itineraries_owner_idx').on(table.ownerId),
  seoIdx: index('itineraries_seo_idx').on(table.isSeoPage, table.destinationCity),
}))

export const destinations = pgTable('destinations', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  countryCode: text('country_code'),
  lat: numeric('lat', { precision: 9, scale: 6 }),
  lng: numeric('lng', { precision: 9, scale: 6 }),
  heroImageUrl: text('hero_image_url'),
  overviewMarkdown: text('overview_markdown'),
  bestTimeToVisit: jsonb('best_time_to_visit').$type<{
    months: string[]
    notes: string
    avoid?: string
  }>(),
  topNeighborhoods: jsonb('top_neighborhoods').$type<Array<{
    name: string
    vibe: string
    bestFor: string[]
  }>>(),
  practical: jsonb('practical').$type<{
    currency: string
    language: string
    plugType: string
    voltage: string
    emergencyNumber: string
    tipping: string
  }>(),
  curatedBy: text('curated_by').default('ai'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const affiliateClicks = pgTable('affiliate_clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'set null' }),
  seoPageId: uuid('seo_page_id'),
  provider: text('provider').notNull(),
  linkKind: text('link_kind').notNull(),
  linkTargetUrl: text('link_target_url').notNull(),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  sessionId: text('session_id'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
}, (table) => ({
  itineraryIdx: index('affiliate_clicks_itinerary_idx').on(table.itineraryId),
  providerIdx: index('affiliate_clicks_provider_idx').on(table.provider),
  clickedAtIdx: index('affiliate_clicks_clicked_at_idx').on(table.clickedAt),
}))

export const generations = pgTable('generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'cascade' }),
  userPrompt: text('user_prompt').notNull(),
  resolvedRequest: jsonb('resolved_request'),
  model: text('model').notNull(),
  promptVersion: text('prompt_version').notNull(),
  tokensIn: integer('tokens_in'),
  tokensOut: integer('tokens_out'),
  costUsd: numeric('cost_usd', { precision: 10, scale: 6 }),
  durationMs: integer('duration_ms'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const seoPages = pgTable('seo_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  pageType: text('page_type').notNull(),
  destinationSlug: text('destination_slug'),
  title: text('title').notNull(),
  metaDescription: text('meta_description').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  itineraryId: uuid('itinerary_id').references(() => itineraries.id, { onDelete: 'set null' }),
  monthlySearches: integer('monthly_searches'),
  qualityScore: numeric('quality_score', { precision: 3, scale: 1 }),
  lastRegenerated: timestamp('last_regenerated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pageTypeIdx: index('seo_pages_page_type_idx').on(table.pageType),
  destinationIdx: index('seo_pages_destination_idx').on(table.destinationSlug),
}))
