'use client'

import Reveal from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import useNow from '@/lib/useNow'
import { comboSum } from '@/app/(store)/_utils/home.utils'
import type { getCombos } from '@/app/(store)/_services/home.api'

export default function ComboCard({ combo: c, index }: { combo: ReturnType<typeof getCombos>[number]; index: number }) {
  useCms()
  const { addCombo } = useStore()
  const now = useNow(30_000)
  const sum = comboSum(c, now ?? undefined)
  return (
    <Reveal delay={index * 0.1}>
      <div className="group overflow-hidden rounded-[3px] border border-background/20 transition hover:border-accent">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={c.image} alt={c.name} className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
          <span className="label-mono absolute left-3 top-3 rounded-[2px] bg-accent px-2 py-1 text-accent-foreground">Save {bdt(Math.max(0, sum - c.price))}</span>
        </div>
        <div className="p-5">
          <p className="label-mono text-background/50">{c.tag}</p>
          <h3 className="font-display mt-1 text-4xl">{c.name}</h3>
          <div className="mt-4 flex items-center justify-between">
            <p><span className="text-xl font-semibold">{bdt(c.price)}</span> <span className="text-sm text-background/50 line-through">{bdt(sum)}</span></p>
            <Button size="sm" variant="light" onClick={() => addCombo(c.id)}>Add combo</Button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
