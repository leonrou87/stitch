import Link from 'next/link'
import { CoverImage } from '@/components/ui/CoverImage'
import { bundleHref, type Bundle } from '@/lib/data/bundles'

// A curated trip. Primary opens it in the wizard at Review — fully filled in, ready to
// adjust dates and book. Secondary drops into the picks step to tweak first.
export function BundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <div className="card group flex flex-col overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <CoverImage imageKey={`city:${bundle.citySlug}`} query={bundle.heroQuery} alt={bundle.title} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-clay-700">
          {bundle.theme}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl">{bundle.title}</h3>
        <p className="mt-1 text-xs text-ink-mute">{bundle.durationDays} days · {bundle.pace} pace · {bundle.placeIds.length} places</p>
        <p className="mt-2 flex-1 text-sm text-ink-soft">{bundle.tagline}</p>
        <div className="mt-4 flex items-center gap-4">
          <Link href={bundleHref(bundle, 'review')} className="btn-clay flex-1 text-sm">Use this trip</Link>
          <Link href={bundleHref(bundle, 'do')} className="text-sm text-ink-mute underline-offset-2 hover:text-ink-soft hover:underline">Edit first</Link>
        </div>
      </div>
    </div>
  )
}
