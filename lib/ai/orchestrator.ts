import Anthropic from '@anthropic-ai/sdk'
import { ItinerarySchema, type Itinerary } from '@/lib/types/itinerary'
import { TripRequest } from '@/lib/types/request'
import { ITINERARY_SYSTEM_PROMPT, PROMPT_VERSION } from './prompts'
import { tools } from './tools'
import { executeToolCall } from './tool-execution'
import { attachAffiliateLinks } from '@/lib/affiliate/registry'

// Default to Sonnet 4.6 for speed/cost; override with STITCH_MODEL (e.g. claude-opus-4-8
// for the highest-quality generation per the spec). The spec was drafted against
// claude-opus-4-7; the current models are opus-4-8 / sonnet-4-6 / haiku-4-5.
const MODEL = process.env.STITCH_MODEL || 'claude-sonnet-4-6'
const MAX_TOOL_ITERATIONS = 8

export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

export interface OrchestratorOptions {
  onStage?: (stage: string) => void // For UX streaming
  onPartialJson?: (chunk: string) => void
}

export async function generateItinerary(
  request: TripRequest,
  options: OrchestratorOptions = {},
): Promise<Itinerary> {
  const { onStage } = options
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  onStage?.('Understanding your trip')

  const userMessage = formatRequestAsUserMessage(request)
  const messages: Anthropic.MessageParam[] = [
    { role: 'user', content: userMessage },
  ]

  let iterations = 0

  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations++

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: ITINERARY_SYSTEM_PROMPT,
      tools,
      messages,
    })

    const toolUses = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
    )

    if (toolUses.length === 0) {
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === 'text',
      )
      if (!textBlock) {
        throw new Error('Model returned no text and no tool calls')
      }

      const json = extractJson(textBlock.text)
      const parsed = ItinerarySchema.safeParse(json)

      if (!parsed.success) {
        messages.push({ role: 'assistant', content: response.content })
        messages.push({
          role: 'user',
          content: `Your JSON output failed schema validation. Errors:\n${JSON.stringify(parsed.error.format(), null, 2)}\n\nFix and re-output the full itinerary.`,
        })
        continue
      }

      const enriched = await attachAffiliateLinks(parsed.data, request)

      enriched.metadata = {
        generatedAt: new Date().toISOString(),
        model: MODEL,
        promptVersion: PROMPT_VERSION,
      }

      return enriched
    }

    onStage?.(stageLabelFromTools(toolUses))

    messages.push({ role: 'assistant', content: response.content })

    const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
      toolUses.map(async (toolUse) => {
        const result = await executeToolCall(toolUse.name, toolUse.input as Record<string, unknown>)
        return {
          type: 'tool_result' as const,
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
        }
      }),
    )

    messages.push({ role: 'user', content: toolResults })
  }

  throw new Error(`Itinerary generation exceeded ${MAX_TOOL_ITERATIONS} tool iterations`)
}

function formatRequestAsUserMessage(request: TripRequest): string {
  return [
    `Plan a trip with the following parameters:`,
    `Destination: ${request.destinationRaw}`,
    request.durationDays ? `Duration: ${request.durationDays} days` : null,
    request.startDate ? `Dates: ${request.startDate}${request.endDate ? ` to ${request.endDate}` : ''}` : null,
    `Travelers: ${request.adults} adult${request.adults > 1 ? 's' : ''}${request.children.length ? `, ${request.children.length} children (ages ${request.children.map((c) => c.age).join(', ')})` : ''}`,
    request.budgetTotalUsd ? `Budget: $${request.budgetTotalUsd} total` : null,
    request.budgetTier ? `Budget tier: ${request.budgetTier}` : null,
    request.vibeTags.length ? `Vibe: ${request.vibeTags.join(', ')}` : null,
    request.pace ? `Pace: ${request.pace}` : null,
    request.dietary.length ? `Dietary: ${request.dietary.join(', ')}` : null,
    request.accessibility.length ? `Accessibility: ${request.accessibility.join(', ')}` : null,
    request.interestsFreeform ? `Additional notes: ${request.interestsFreeform}` : null,
    request.originAirport ? `Departing from: ${request.originAirport}` : null,
    ``,
    `Original user message: "${request.rawUserMessage}"`,
    ``,
    `Use your tools to ground the plan in real options. Output the final JSON itinerary.`,
  ].filter(Boolean).join('\n')
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('No JSON object found in model output')
  }
  return JSON.parse(raw.slice(start, end + 1))
}

function stageLabelFromTools(toolUses: Anthropic.ToolUseBlock[]): string {
  const names = new Set(toolUses.map((t) => t.name))
  if (names.has('search_flights')) return 'Finding flights'
  if (names.has('search_hotels')) return 'Picking neighborhoods to stay'
  if (names.has('search_activities')) return 'Curating activities'
  if (names.has('search_restaurants')) return 'Selecting restaurants'
  if (names.has('get_destination_overview')) return 'Getting local context'
  if (names.has('get_weather_forecast')) return 'Checking weather'
  return 'Building your trip'
}
