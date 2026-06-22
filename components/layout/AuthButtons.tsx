'use client'

import { SignInButton, UserButton, useUser } from '@clerk/nextjs'

// Renders Clerk's sign-in / account UI, but only when Clerk is configured (public key set).
// When unset it renders nothing, so the header is unaffected before keys are added.
const enabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function AuthButtons() {
  if (!enabled) return null
  return <AuthInner />
}

function AuthInner() {
  const { isSignedIn } = useUser()
  if (isSignedIn) return <UserButton />
  return (
    <SignInButton mode="modal">
      <button className="text-ink-soft transition-colors hover:text-clay-700">Sign in</button>
    </SignInButton>
  )
}
