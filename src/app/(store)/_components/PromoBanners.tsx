'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import useNow from '@/lib/useNow'
import { useCms } from '@/lib/useCms'
import { liveBanners } from '@/lib/storefront'
import { cn } from '@/lib/utils'

/** Slim promo grid fed by CMS banners with placement "promo". */
export default function PromoBanners() {
  useCms()
  const now = useNow(30_000)
  const list = now === null ? [] : liveBanners('promo', now)
  if (list.length === 0) return null
  return (
    <section className={cn('mx-auto mt-6 grid max-w-[88rem] gap-4 px-5 lg:px-10', list.length > 1 && 'sm:grid-cols-2', list.length > 2 && 'lg:grid-cols-3')}>
      {list.map((b, i) => {
        const body = (
          <div className="group relative flex h-40 items-end overflow-hidden rounded-[3px] bg-foreground text-background sm:h-44">
            {b.image && <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-[1200ms] group-hover:scale-110 group-hover:opacity-80" />}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/30 to-transparent" />
            <div className="relative flex w-full items-end justify-between gap-4 p-5">
              <div>
                {b.subtitle && <p className="label-mono text-background/70">{b.subtitle}</p>}
                <h3 className="font-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2">{b.title}</h3>
              </div>
              {b.ctaLink && (
                <span className="label-mono flex shrink-0 items-center gap-1.5 rounded-full bg-background px-3 py-2 text-foreground transition group-hover:bg-accent group-hover:text-accent-foreground">
                  {b.ctaLabel || 'View'} <ArrowUpRight size={13} />
                </span>
              )}
            </div>
          </div>
        )
        return (
          <Reveal key={b.id} delay={i * 0.08}>
            {b.ctaLink ? <Link href={b.ctaLink} className="block">{body}</Link> : body}
          </Reveal>
        )
      })}
    </section>
  )
}
