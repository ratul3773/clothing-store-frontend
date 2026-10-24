'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheeet'
import { Field, inputCls } from '@/components/common/FormField'
import { sizeChart, type Product } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { FIT_PREFERENCES } from '@/app/(store)/p/[slug]/_constants/product.constants'
import { recommend } from '@/app/(store)/p/[slug]/_utils/size.utils'

interface Props { p: Product; open: boolean; onOpenChange: (b: boolean) => void; onPick: (s: string) => void }

export default function SizeAssistant({ p, open, onOpenChange, onPick }: Props) {
  const [h, setH] = useState('172')
  const [w, setW] = useState('74')
  const [pref, setPref] = useState('regular')
  const r = recommend(p, +h, +w, pref)
  const measure = (sizeChart[p.category] ?? []).find((x) => x.size === r.size)?.a
  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Smart size assistant" description="Uses our real size chart. It never invents measurements." side="center">
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Height (cm)"><input className={inputCls} inputMode="numeric" value={h} onChange={(e) => setH(e.target.value)} /></Field>
          <Field label="Weight (kg)"><input className={inputCls} inputMode="numeric" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        </div>
        <div className="flex gap-2">
          {FIT_PREFERENCES.map((x) => (
            <button key={x} onClick={() => setPref(x)} className={cn('label-mono flex-1 rounded-[3px] border py-3 transition', pref === x ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground')}>{x}</button>
          ))}
        </div>
        <motion.div key={r.size} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-[3px] bg-foreground p-6 text-background">
          <p className="label-mono text-background/60">We suggest</p>
          <p className="font-display text-8xl text-accent">{r.size}</p>
          <p className="mt-2 text-sm text-background/80">Your estimated {r.shirts ? 'chest' : 'waist'} is about {r.target}". {p.name} in {r.size}{measure ? ` measures ${measure} and` : ''} is cut as {p.fit.toLowerCase()}. Between sizes? Size up for comfort.</p>
        </motion.div>
        <Button className="w-full" size="lg" variant="accent" onClick={() => { onPick(r.size); onOpenChange(false) }}>Use size {r.size}</Button>
      </div>
    </Sheet>
  )
}
