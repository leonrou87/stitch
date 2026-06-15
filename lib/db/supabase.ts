import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-side Supabase client using the service-role key (bypasses RLS). Never import this
// into client components. Returns null when env is absent so local dev can fall back to the
// JSON file store and `next build` of static pages never needs a connection.
let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}
