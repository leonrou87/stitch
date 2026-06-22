import { z } from 'zod'

export const LocationSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  googleMapsUrl: z.string().url().optional(),
  neighborhood: z.string().optional(),
})

export const AffiliateLinkSchema = z.object({
  provider: z.string(), // 'Booking.com', 'Kiwi', 'Viator', etc.
  url: z.string().url(),
  label: z.string(), // CTA text shown on button
  kind: z.enum([
    'flight', 'hotel', 'activity', 'restaurant',
    'car', 'train', 'ferry', 'insurance',
    'esim', 'gear', 'currency', 'other',
  ]),
  trackingId: z.string().optional(), // populated when wrapped in /r/[id]
})

export const ActivitySchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(), // "16:00"
  durationMinutes: z.number().int().positive().optional(),
  title: z.string(),
  type: z.enum([
    'explore', 'museum', 'gallery', 'restaurant', 'cafe', 'bar',
    'shopping', 'experience', 'outdoor', 'transport', 'rest',
    'show', 'class', 'sightseeing', 'nightlife', 'other',
  ]),
  description: z.string(), // Specific and useful, not generic
  location: LocationSchema.optional(),
  costEstimateUsd: z.number().nonnegative().optional(),
  tips: z.array(z.string()).optional(),
  whyThis: z.string().optional(), // Editorial reasoning
  bookingRequired: z.boolean().default(false),
  affiliateLinks: z.array(AffiliateLinkSchema).default([]),
  alternatives: z.array(z.object({
    title: z.string(),
    note: z.string(),
  })).optional(),
})

export const FlightLegSchema = z.object({
  from: z.string(), // IATA or city
  to: z.string(),
  depart: z.string(), // ISO
  arrive: z.string().optional(),
  carrier: z.string(),
  flightNumber: z.string().optional(),
  durationHours: z.number().positive(),
  stops: z.number().int().nonnegative().default(0),
  cabinClass: z.enum(['economy', 'premium-economy', 'business', 'first']).default('economy'),
})

export const FlightOptionSchema = z.object({
  optionLabel: z.string(), // "Best value", "Fastest", "Direct"
  outbound: FlightLegSchema,
  return: FlightLegSchema.optional(),
  estimatedPriceUsd: z.number().nonnegative(),
  rationale: z.string().optional(),
  affiliateLinks: z.array(AffiliateLinkSchema),
})

export const HotelOptionSchema = z.object({
  name: z.string(),
  tier: z.enum(['budget', 'mid', 'boutique', 'luxury']),
  estimatedPriceUsdPerNight: z.number().positive(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().nonnegative().optional(),
  amenities: z.array(z.string()).default([]),
  location: LocationSchema,
  rationale: z.string(),
  imageUrl: z.string().url().optional(),
  affiliateLinks: z.array(AffiliateLinkSchema),
})

export const StaySchema = z.object({
  nightRange: z.string(), // "Mar 14-18" or "Nights 1-4"
  neighborhood: z.string(),
  rationale: z.string(),
  options: z.array(HotelOptionSchema).min(1).max(5),
})

export const DaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().optional(), // ISO date
  title: z.string(), // Editorial title for the day
  narrative: z.string(), // 2-4 sentence intro setting up the day
  activities: z.array(ActivitySchema).min(1),
  dailyBudgetUsd: z.number().nonnegative().optional(),
})

export const RestaurantSchema = z.object({
  name: z.string(),
  cuisine: z.string(),
  neighborhood: z.string().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']),
  whatToOrder: z.string().optional(),
  notes: z.string().optional(),
  location: LocationSchema.optional(),
  bookingDifficulty: z.enum(['walk-in', 'recommended', 'required', 'difficult']).optional(),
  affiliateLinks: z.array(AffiliateLinkSchema).default([]),
})

export const PreTripSchema = z.object({
  visaNotes: z.string().optional(),
  passportCheck: z.string().optional(), // e.g., "Must be valid 6 months after travel"
  vaccinations: z.array(z.string()).optional(),
  insuranceRecommendations: z.array(AffiliateLinkSchema).default([]),
  esimRecommendations: z.array(AffiliateLinkSchema).default([]),
  currencyNotes: z.string().optional(),
  packingTips: z.array(z.string()).default([]),
  appsToInstall: z.array(z.object({
    name: z.string(),
    why: z.string(),
  })).default([]),
})

export const PracticalSchema = z.object({
  emergencyNumber: z.string().optional(),
  plugType: z.string().optional(),
  voltage: z.string().optional(),
  tipping: z.string().optional(),
  taxRefund: z.string().optional(),
  commonPhrases: z.array(z.object({
    phrase: z.string(),
    pronunciation: z.string().optional(),
    meaning: z.string(),
  })).default([]),
  safety: z.string().optional(),
})

export const GettingAroundSchema = z.object({
  fromAirport: z.string().optional(),
  transitPass: z.string().optional(),
  rideshare: z.string().optional(),
  walkability: z.string().optional(),
  cyclingNotes: z.string().optional(),
  intercityTransport: z.array(z.object({
    from: z.string(),
    to: z.string(),
    mode: z.string(),
    durationHours: z.number().optional(),
    costUsd: z.number().optional(),
    affiliateLinks: z.array(AffiliateLinkSchema).default([]),
  })).default([]),
})

export const ItinerarySchema = z.object({
  schemaVersion: z.literal(1).default(1),

  destination: z.object({
    primaryCity: z.string(),
    country: z.string(),
    countryCode: z.string().length(2).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    regionsVisited: z.array(z.string()).default([]),
  }),

  dates: z.object({
    start: z.string().optional(), // ISO; optional if flexible
    end: z.string().optional(),
    flexible: z.boolean().default(false),
    durationDays: z.number().int().positive(),
    season: z.string().optional(), // "Spring", "Cherry blossom season"
  }),

  travelers: z.object({
    adults: z.number().int().positive(),
    children: z.array(z.object({ age: z.number().int().nonnegative() })).default([]),
    relationship: z.enum([
      'solo', 'couple', 'family', 'friends',
      'multigenerational', 'business', 'other',
    ]).optional(),
  }),

  preferences: z.object({
    vibeTags: z.array(z.string()).default([]), // 'foodie', 'art', 'adventure', etc.
    budgetTotalUsd: z.number().positive().optional(),
    budgetTier: z.enum(['shoestring', 'budget', 'mid', 'comfortable', 'luxury']).optional(),
    pace: z.enum(['slow', 'moderate', 'packed']).default('moderate'),
    dietary: z.array(z.string()).default([]),
    accessibility: z.array(z.string()).default([]),
    interestsFreeform: z.string().optional(),
  }),

  summary: z.string(), // 2-4 sentence overview of the trip

  preTrip: PreTripSchema.optional(),
  flights: z.array(FlightOptionSchema).optional(),
  stays: z.array(StaySchema).optional(),
  days: z.array(DaySchema).min(1),
  restaurantsAppendix: z.array(RestaurantSchema).default([]),
  gettingAround: GettingAroundSchema.optional(),
  practical: PracticalSchema.optional(),

  metadata: z.object({
    generatedAt: z.string(),
    model: z.string(),
    promptVersion: z.string(),
  }),

  // The picks behind this trip, so it can be re-stitched in place (change days/pace,
  // add/remove stops) without losing the original selection. Optional for back-compat.
  source: z.object({
    citySlug: z.string(),
    placeIds: z.array(z.string()),
    pace: z.enum(['slow', 'moderate', 'packed']).optional(),
    startDate: z.string().optional(),
  }).optional(),
})

export type Itinerary = z.infer<typeof ItinerarySchema>
export type Activity = z.infer<typeof ActivitySchema>
export type Day = z.infer<typeof DaySchema>
export type FlightOption = z.infer<typeof FlightOptionSchema>
export type HotelOption = z.infer<typeof HotelOptionSchema>
export type Stay = z.infer<typeof StaySchema>
export type Restaurant = z.infer<typeof RestaurantSchema>
export type AffiliateLink = z.infer<typeof AffiliateLinkSchema>
