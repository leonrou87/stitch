import { NextRequest } from 'next/server'
import { generate } from '@/lib/ai/generate'
import { parseTripRequest, missingCriticalFields } from '@/lib/ai/intake'
import { saveItinerary } from '@/lib/db/store'
import { generateSlug } from '@/lib/seo/slug'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const message: string = typeof body?.message === 'string' ? body.message : ''

  if (!message.trim()) {
    return Response.json({ error: 'Tell me about your trip first.' }, { status: 400 })
  }

  const tripRequest = parseTripRequest(message)
  const missing = missingCriticalFields(tripRequest)
  if (missing.includes('destination')) {
    return Response.json(
      { error: "I couldn't place a destination in that. Try naming a city or region." },
      { status: 422 },
    )
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        const itinerary = await generate(tripRequest, {
          onStage: (stage) => send('stage', { stage }),
        })

        const slug = generateSlug(itinerary)
        const saved = await saveItinerary({ slug, data: itinerary })

        send('complete', { slug: saved.slug, url: `/i/${saved.slug}` })
        controller.close()
      } catch (err) {
        const messageText = err instanceof Error ? err.message : 'Unknown error'
        send('error', { message: messageText })
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
