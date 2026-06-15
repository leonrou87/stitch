import { NextRequest } from 'next/server'
import { logClick, isAllowedAffiliateHost } from '@/lib/db/store'

export const runtime = 'nodejs'

// Stateless affiliate redirect: /r?u=<targetUrl>&p=<provider>&k=<kind>&i=<itineraryId>
// Records the click best-effort, then 302s to the partner with our tracking params intact.
// Host allowlist prevents the encoded target from being abused as an open redirect.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const target = sp.get('u') ?? ''
  const provider = sp.get('p') ?? 'unknown'
  const kind = sp.get('k') ?? 'other'
  const itineraryId = sp.get('i')

  if (!target || !isAllowedAffiliateHost(target)) {
    return new Response('Invalid or disallowed redirect target', { status: 400 })
  }

  // Best-effort; never block the redirect on logging.
  try {
    await logClick({ itineraryId, provider, kind, targetUrl: target })
  } catch {
    /* ignore */
  }

  return Response.redirect(target, 302)
}
