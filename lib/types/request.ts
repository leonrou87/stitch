import { z } from 'zod'

export const TripRequestSchema = z.object({
  destinationRaw: z.string(), // User's free-text destination
  destinationResolved: z.object({
    primaryCity: z.string(),
    country: z.string(),
  }).optional(),

  durationDays: z.number().int().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  flexibleDates: z.boolean().default(false),

  originAirport: z.string().optional(),
  needsFlights: z.boolean().default(true),

  adults: z.number().int().positive().default(1),
  children: z.array(z.object({ age: z.number().int().nonnegative() })).default([]),
  relationship: z.string().optional(),

  budgetTotalUsd: z.number().positive().optional(),
  budgetTier: z.enum(['shoestring', 'budget', 'mid', 'comfortable', 'luxury']).optional(),

  vibeTags: z.array(z.string()).default([]),
  pace: z.enum(['slow', 'moderate', 'packed']).optional(),
  dietary: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([]),
  interestsFreeform: z.string().optional(),

  rawUserMessage: z.string(),
  clarifyingQuestions: z.array(z.string()).default([]),
})

export type TripRequest = z.infer<typeof TripRequestSchema>

export const MissingFieldSchema = z.enum([
  'destination', 'duration', 'travelers', 'origin', 'budget',
])
export type MissingField = z.infer<typeof MissingFieldSchema>
