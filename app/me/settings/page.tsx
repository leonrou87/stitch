import Link from 'next/link'
import { SettingsForm } from '@/components/account/SettingsForm'
import { currentUserId, clerkEnabled } from '@/lib/auth/clerk'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Settings', robots: { index: false } }

export default async function SettingsPage() {
  const userId = await currentUserId()

  return (
    <div className="container-wide py-14">
      <h1 className="font-serif text-4xl">Settings</h1>
      <p className="mt-3 max-w-prose text-ink-soft">Your travel defaults — we use them to pre-fill new trips.</p>

      {userId ? (
        <SettingsForm />
      ) : (
        <div className="card mt-6 max-w-lg p-6">
          <p className="text-ink-soft">
            {clerkEnabled ? 'Sign in to save your travel defaults across devices.' : 'Accounts aren’t enabled yet.'}
          </p>
          <Link href="/trips" className="btn-clay mt-4">Browse trips</Link>
        </div>
      )}
    </div>
  )
}
