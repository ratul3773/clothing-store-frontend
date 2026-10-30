'use client'

import Link from 'next/link'
import { ArrowUpRight, Zap } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import ProductCard from '@/components/common/ProductCard'
import Countdown from '@/components/common/Countdown'
import useNow from '@/lib/useNow'
import { useCms } from '@/lib/useCms'
import { liveFlash, visibleProducts } from '@/lib/storefront'
import ProductCarousel from '@/components/common/ProductCarousel'

/** Home page flash-sale strip, rendered only while a campaign is live. */
export default function FlashSaleStrip() {
  useCms()
  const now = useNow(1000)
  // The live check depends on the clock, so render nothing until mounted to keep hydration identical.
  const f = now === null ? undefined : liveFlash(now)
  if (!f) return null
  const list = visibleProducts(f.productIds)
  if (list.length === 0) return null

  return (
    <section className="mt-24 bg-foreground py-16 text-background">
      <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="label-mono flex items-center gap-2 text-accent"><Zap size={14} className="fill-accent" /> Flash sale · extra {f.discountPct}% off</p>
            <h2 className="font-display mt-3 text-4xl">{f.title}</h2>
            {f.subtitle && <p className="mt-3 text-background/70">{f.subtitle}</p>}
          </div>
          <div>
            <p className="label-mono mb-2 text-background/60">Ends in</p>
            <Countdown endsAt={f.endsAt} />
          </div>
        </Reveal>
        <ProductCarousel items={list} className="text-background [&_.text-muted-foreground]:text-background/60" />
        <Link href="/shop?offers=1" className="label-mono group mt-10 inline-flex items-center gap-2">Shop all offers <ArrowUpRight size={14} className="transition group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
      </div>
    </section>
  )
}
