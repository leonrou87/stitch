import { Suspense } from 'react'
import { PlanClient } from '@/components/planner/PlanClient'

export const metadata = { title: 'Plan a trip' }

export default function PlanPage() {
  return (
    <div className="container-wide">
      <Suspense fallback={<div className="py-10 text-ink-mute">Loading…</div>}>
        <PlanClient />
      </Suspense>
    </div>
  )
}
