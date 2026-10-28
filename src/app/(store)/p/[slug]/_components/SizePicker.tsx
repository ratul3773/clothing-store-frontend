'use client'

import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LOW_STOCK_THRESHOLD } from '@/app/(store)/p/[slug]/_constants/product.constants'

interface Props {
  sizes: string[]
  selected: string | null
  avail: number | null
  shake: number
  stockFor: (size: string) => number
  onSelect: (s: string) => void
  onAssist: () => void
}

export default function SizePicker({ sizes, selected, avail, shake, stockFor, onSelect, onAssist }: Props) {
  return (
    <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}} className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <p className="label-mono">Size</p>
        <button onClick={onAssist} className="label-mono group flex items-center gap-1.5 text-accent"><Sparkles size={14} className="transition group-hover:rotate-90" /> Find my size</button>
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((s) => {
          const n = stockFor(s)
          return (
            <button key={s} disabled={n === 0} onClick={() => onSelect(s)} className={cn('relative grid h-10 min-w-10 place-items-center overflow-hidden rounded-[3px] border px-3 font-semibold transition', selected === s ? 'border-foreground bg-foreground text-background' : 'border-foreground/30 hover:-translate-y-0.5 hover:border-foreground', n === 0 && 'cursor-not-allowed opacity-35 hover:translate-y-0 hover:border-foreground/30')}>
              {s}
              {n === 0 && <span className="absolute inset-0 grid place-items-center"><span className="h-px w-[140%] -rotate-[35deg] bg-foreground" /></span>}
            </button>
          )
        })}
      </div>
      <p className="mt-3 h-5 text-sm">
        {selected && avail !== null && (avail <= LOW_STOCK_THRESHOLD ? <span className="font-medium text-warning">Only {avail} left in {selected}</span> : <span className="text-success">In stock ({avail} left)</span>)}
      </p>
    </motion.div>
  )
}
