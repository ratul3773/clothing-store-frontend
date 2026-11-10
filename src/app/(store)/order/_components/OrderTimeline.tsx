'use client'

import { motion } from 'motion/react'
import { LIFECYCLE } from '@/data/orders'
import StatusBadge from '@/components/common/StatusBadge'

export default function OrderTimeline({ idx }: { idx: number }) {
  return (
    <ol className="mt-12 grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
      {LIFECYCLE.map((s, i) => (
        <li key={s} className="relative">
          <div className="h-1.5 overflow-hidden rounded-full bg-foreground/15"><motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: i <= idx ? '100%' : 0 }} transition={{ duration: 0.6, delay: 0.9 + i * 0.12 }} /></div>
          <div className="mt-2"><StatusBadge status={s} /></div>
        </li>
      ))}
    </ol>
  )
}
