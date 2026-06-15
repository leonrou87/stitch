// Lightweight, deterministic free-text -> TripRequest parser.
// Used to structure the user's prompt before generation. The heavy lifting (the actual
// itinerary) is done by Claude (orchestrator) or the offline generator (fallback).
import { TripRequestSchema, type TripRequest } from '@/lib/types/request'
import { destinations } from '@/lib/data/destinations'

const VIBE_MAP: Array<[RegExp, string]> = [
  [/foodie|food|culinary|eat|restaurant|ramen|taco|wine|coffee/i, 'foodie'],
  [/art|gallery|museum|design|architecture/i, 'art'],
  [/nightlife|bar|club|jazz|music|party/i, 'nightlife'],
  [/hike|hiking|outdoor|nature|beach|mountain|surf|road ?trip|ring ?road/i, 'outdoor'],
  [/history|historic|temple|heritage|ancient/i, 'history'],
  [/relax|slow|chill|spa|romantic/i, 'relaxed'],
  [/honeymoon/i, 'honeymoon'],
  [/budget|cheap|shoestring/i, 'budget'],
  [/luxury|luxe|high.?end|splurge/i, 'luxury'],
]

export function parseTripRequest(message: string): TripRequest {
  const text = message.trim()
  const lower = text.toLowerCase()

  // Destination: match seed cities/countries first, else text after "in"/"to".
  let destinationRaw = ''
  for (const d of destinations) {
    if (lower.includes(d.city.toLowerCase()) || lower.includes(d.slug.replace(/-/g, ' '))) {
      destinationRaw = d.city
      break
    }
  }
  if (!destinationRaw) {
    const m = text.match(/\b(?:in|to|visit|visiting|trip to|days? in)\s+([A-Z][A-Za-z .'-]+?)(?:[,.]|\s+for\b|\s+with\b|\s+in\b|$)/)
    destinationRaw = (m?.[1] ?? text.split(/[,.]/)[0]).trim()
  }

  // Duration.
  let durationDays: number | undefined
  const dMatch = lower.match(/(\d+)\s*[- ]?\s*(?:day|days|night|nights)/)
  if (dMatch) durationDays = parseInt(dMatch[1], 10)
  else if (/long weekend/.test(lower)) durationDays = 3
  else if (/weekend/.test(lower)) durationDays = 2
  else if (/(two|2)\s*weeks?/.test(lower)) durationDays = 14
  else if (/(one|1|a)\s*week/.test(lower)) durationDays = 7
  else if (/(\d+)\s*weeks?/.test(lower)) durationDays = parseInt(lower.match(/(\d+)\s*weeks?/)![1], 10) * 7

  // Travelers.
  let adults = 1
  let relationship: string | undefined
  const children: { age: number }[] = []
  if (/\bsolo\b|\bby myself\b|\balone\b/.test(lower)) { adults = 1; relationship = 'solo' }
  else if (/couple|my partner|my wife|my husband|my girlfriend|my boyfriend|honeymoon/.test(lower)) { adults = 2; relationship = 'couple' }
  else if (/family/.test(lower)) { adults = 2; relationship = 'family' }
  else if (/friends/.test(lower)) { adults = 3; relationship = 'friends' }
  const kidsMatch = lower.match(/kids?\s*(?:aged?\s*)?([\d,\s and]+)/)
  if (kidsMatch) {
    const ages = kidsMatch[1].match(/\d+/g)?.map(Number) ?? []
    ages.forEach((age) => children.push({ age }))
    if (children.length) relationship = 'family'
  }
  const adultsMatch = lower.match(/(\d+)\s*adults?/)
  if (adultsMatch) adults = parseInt(adultsMatch[1], 10)

  // Budget.
  let budgetTotalUsd: number | undefined
  const budgetMatch = text.match(/\$\s?([\d,]{3,})/)
  if (budgetMatch) budgetTotalUsd = parseInt(budgetMatch[1].replace(/,/g, ''), 10)
  let budgetTier: TripRequest['budgetTier']
  if (/shoestring|backpack/.test(lower)) budgetTier = 'shoestring'
  else if (/budget|cheap/.test(lower)) budgetTier = 'budget'
  else if (/luxury|luxe|splurge|high.?end/.test(lower)) budgetTier = 'luxury'

  // Vibe tags.
  const vibeTags = Array.from(new Set(VIBE_MAP.filter(([re]) => re.test(text)).map(([, tag]) => tag)))
    .filter((t) => !['budget', 'luxury', 'honeymoon'].includes(t) || t === 'honeymoon')

  // Pace.
  let pace: TripRequest['pace']
  if (/packed|see everything|jam|lots to do/.test(lower)) pace = 'packed'
  else if (/slow|relaxed|leisurely|chill/.test(lower)) pace = 'slow'

  return TripRequestSchema.parse({
    destinationRaw,
    durationDays,
    flexibleDates: !/\b(20\d\d|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(lower),
    needsFlights: /flight|fly|flying|from\s+[a-z]/i.test(lower),
    adults,
    children,
    relationship,
    budgetTotalUsd,
    budgetTier,
    vibeTags,
    pace,
    interestsFreeform: text,
    rawUserMessage: message,
  })
}

export function missingCriticalFields(req: TripRequest): string[] {
  const missing: string[] = []
  if (!req.destinationRaw || req.destinationRaw.length < 2) missing.push('destination')
  if (!req.durationDays) missing.push('duration')
  return missing
}
