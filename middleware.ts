import { NextResponse, type NextRequest } from 'next/server'

// Clerk middleware only when configured; otherwise a passthrough so the site runs with no
// auth keys. (clerkMiddleware establishes the auth() context for server routes/pages.)
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

let handler: (req: NextRequest) => Promise<Response> | Response = () => NextResponse.next()

if (clerkEnabled) {
  // Lazy require so the package isn't initialized when keys are absent.
  const { clerkMiddleware } = require('@clerk/nextjs/server')
  handler = clerkMiddleware()
}

export default handler

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)', '/(api|trpc)(.*)'],
}
