// Clerk is optional. The whole app works signed-out and with no keys configured; auth only
// activates when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (+ CLERK_SECRET_KEY) are set. This flag
// gates every Clerk call so the live site never breaks before keys are added.
export const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

// Server-only: the current user id, or null when signed out / Clerk disabled. Never throws.
export async function currentUserId(): Promise<string | null> {
  if (!clerkEnabled) return null
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { userId } = await auth()
    return userId ?? null
  } catch {
    return null
  }
}
