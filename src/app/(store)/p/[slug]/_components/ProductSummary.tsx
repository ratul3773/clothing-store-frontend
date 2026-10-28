'use client'

import { Star, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Countdown from '@/components/common/Countdown'
import { useStore } from '@/components/providers/StoreProvider'
import { activeFlash, priceOf, type Product } from '@/data/catalog'
import { reviewCount } from '@/lib/storefront'
import { useCms } from '@/lib/useCms'
import { bdt } from '@/lib/utils'

export default function ProductSummary({ p }: { p: Product }) {
  useCms()
  const { reviews } = useStore()
  const flash = activeFlash(p)
  const was = flash ? p.offer ?? p.price : p.offer ? p.price : 0
  return (
    <>
      <p className="label-mono text-muted-foreground">{p.sub} · {p.fit}</p>
      <h1 className="font-display mt-2 text-2xl">{p.name}</h1>
      <div className="mt-4 flex items-center gap-4">
        <span className="text-lg font-semibold">{bdt(priceOf(p))}</span>
        {was > 0 && <span className="text-lg text-muted-foreground line-through">{bdt(was)}</span>}
        {flash ? <Badge className="bg-accent text-accent-foreground">{`FLASH −${flash.discountPct}%`}</Badge> : p.offer ? (p.badges.map((badge) => <Badge key={badge}>{badge}</Badge>)) : null}
        <span className="ml-auto flex items-center gap-1 text-sm"><Star size={15} className="fill-accent text-accent" /> {p.rating} <span className="text-muted-foreground">({reviewCount(p, reviews)})</span></span>
      </div>
      {flash && (
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-[3px] border border-accent/50 bg-accent/5 p-3">
          <p className="label-mono flex items-center gap-2 text-accent"><Zap size={14} className="fill-accent" /> {flash.title} ends in</p>
          <Countdown endsAt={flash.endsAt} tone="dark" className="gap-1.5" />
        </div>
      )}
      <p className="mt-5 leading-relaxed text-foreground/80">{p.desc}</p>
    </>
  )
}
