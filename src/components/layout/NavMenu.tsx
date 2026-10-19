'use client'

import Link from 'next/link'
import * as NM from '@radix-ui/react-navigation-menu'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { taxonomy } from '@/data/catalog'
import { useCms } from '@/lib/useCms'
import { liveProducts } from '@/lib/storefront'

const trigger =
  'label-mono group relative flex items-center gap-1 px-3 py-2 outline-none transition-colors hover:text-accent data-[state=open]:text-accent'
const underline =
  'absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-data-[state=open]:scale-x-100'

export default function NavMenu() {
  useCms()
  const live = liveProducts()
  return (
    <NM.Root className="relative hidden lg:block" delayDuration={80}>
      <NM.List className="flex items-center gap-1">
        <NM.Item>
          <NM.Link asChild>
            <Link href="/shop" className={trigger}>All<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
        {taxonomy.map((t) => (
          <NM.Item key={t.cat}>
            <NM.Trigger className={trigger}>
              {t.label}
              <ChevronDown size={12} className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
              <span className={underline} />
            </NM.Trigger>
            <NM.Content className="absolute left-0 top-full pt-3 data-[motion=from-end]:animate-[fadein_.3s_ease] data-[motion=from-start]:animate-[fadein_.3s_ease] data-[state=open]:animate-[fadein_.3s_ease]">
              <div className="grid w-[34rem] grid-cols-[1fr_12rem] overflow-hidden rounded-[3px] border border-foreground bg-card shadow-2xl">
                <ul className="p-3">
                  <li>
                    <NM.Link asChild>
                      <Link href={`/shop?cat=${t.cat}`} className="group flex items-center justify-between rounded-[2px] px-3 py-2.5 transition hover:bg-foreground hover:text-background">
                        <span className="font-display text-3xl">All {t.label}</span>
                        <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </NM.Link>
                  </li>
                  {t.subs.map((s) => {
                    const n = live.filter((p) => p.category === t.cat && p.sub === s).length
                    return (
                      <li key={s}>
                        <NM.Link asChild>
                          <Link href={`/shop?cat=${t.cat}&sub=${s}`} className="group flex items-center justify-between rounded-[2px] px-3 py-2.5 text-sm transition hover:translate-x-1 hover:bg-accent/10 hover:text-accent">
                            {s}
                            <span className="label-mono text-muted-foreground">{n}</span>
                          </Link>
                        </NM.Link>
                      </li>
                    )
                  })}
                </ul>
                <div className="relative bg-foreground text-background">
                  <img src={t.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent" />
                  <p className="absolute inset-x-3 bottom-3 text-xs leading-snug">{t.blurb}</p>
                </div>
              </div>
            </NM.Content>
          </NM.Item>
        ))}
        <NM.Item>
          <NM.Link asChild>
            <Link href="/shop?offers=1" className={trigger}>Offers<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
        <NM.Item>
          <NM.Link asChild>
            <Link href="/contact" className={trigger}>Contact<span className={underline} /></Link>
          </NM.Link>
        </NM.Item>
      </NM.List>
    </NM.Root>
  )
}
