import { cn } from '@/lib/utils'
import type { BannerDraft } from '../_utils/banner.utils'

export default function BannerPreview({ d }: { d: Pick<BannerDraft, 'title' | 'subtitle' | 'image' | 'ctaLabel' | 'placement'> }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md border border-border bg-muted', d.placement === 'hero' ? 'aspect-[16/7]' : 'aspect-[16/5]')}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {d.image && <img src={d.image} alt="" className="absolute inset-0 size-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="relative flex h-full max-w-[70%] flex-col justify-center gap-1.5 p-5 text-white">
        <p className="text-lg font-semibold leading-tight">{d.title || 'Banner title'}</p>
        {d.subtitle && <p className="line-clamp-2 text-xs text-white/85">{d.subtitle}</p>}
        {d.ctaLabel && <span className="mt-1 w-fit rounded bg-white px-3 py-1 text-xs font-medium text-black">{d.ctaLabel}</span>}
      </div>
    </div>
  )
}
