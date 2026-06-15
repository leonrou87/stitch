// Single entrypoint for itinerary generation. Uses Claude when ANTHROPIC_API_KEY is
// set, otherwise the deterministic offline generator. Both paths run affiliate
// enrichment (the offline path enriches here; the orchestrator does it internally).
import type { Itinerary } from '@/lib/types/itinerary'
import type { TripRequest } from '@/lib/types/request'
import { generateItinerary, hasAnthropicKey, type OrchestratorOptions } from './orchestrator'
import { generateItineraryFallback } from './fallback'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'

export async function generate(request: TripRequest, options: OrchestratorOptions = {}): Promise<Itinerary> {
  if (hasAnthropicKey()) {
    return generateItinerary(request, options)
  }

  const { onStage } = options
  // Mirror the live stage sequence so the UX is identical with or without a key.
  const stages = [
    'Understanding your trip',
    'Getting local context',
    'Picking neighborhoods to stay',
    'Curating activities',
    'Selecting restaurants',
    'Building your day-by-day',
  ]
  for (const s of stages) {
    onStage?.(s)
    await sleep(280)
  }

  const itinerary = generateItineraryFallback(request)
  return attachAffiliateLinks(itinerary, request)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
