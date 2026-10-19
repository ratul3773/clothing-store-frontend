'use client'

import Reveal from '@/components/common/Reveal'
import ComboCard from '@/app/(store)/_components/ComboCard'
import { useCms } from '@/lib/useCms'
import { getCombos } from '@/app/(store)/_services/home.api'

export default function ComboDeals() {
  useCms()
  const list = getCombos()
  if (list.length === 0) return null
  return (
    <section id="combos" className="relative mt-32 bg-foreground py-24 text-background">
      <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
        <Reveal className="mb-12 max-w-2xl">
          <p className="label-mono text-accent">Combos · stock reserved from each piece</p>
          <h2 className="font-display mt-3 text-[clamp(3.5rem,8vw,7rem)]">Wear it as a pair</h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {list.map((c, i) => <ComboCard key={c.id} combo={c} index={i} />)}
        </div>
      </div>
    </section>
  )
}
