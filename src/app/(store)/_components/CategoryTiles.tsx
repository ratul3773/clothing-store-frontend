'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import { useCms } from '@/lib/useCms'
import { getCategoryTiles } from '@/app/(store)/_services/home.api'

export default function CategoryTiles() {
  useCms()
  const tiles = getCategoryTiles()
  if (tiles.length === 0) return null
  return (
    <section className="mx-auto grid max-w-[88rem] gap-4 px-5 lg:grid-cols-2 lg:px-10">
      {tiles.map((c, k) => (
        <Reveal key={c.cat} delay={k * 0.1}>
          <Link href={`/shop?cat=${encodeURIComponent(c.cat)}`} className="group relative block aspect-[16/10] overflow-hidden rounded-[3px] bg-foreground">
            <img src={c.image} alt={c.title} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-[1200ms] group-hover:scale-110 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-background">
              <div>
                <h2 className="font-display text-[clamp(4rem,9vw,8rem)] transition-transform duration-500 group-hover:translate-x-3">{c.title}</h2>
                <p className="label-mono text-background/70">{c.note}</p>
              </div>
              <span className="grid h-14 w-14 place-items-center rounded-full bg-background text-foreground transition duration-500 group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-foreground"><ArrowUpRight /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </section>
  )
}
