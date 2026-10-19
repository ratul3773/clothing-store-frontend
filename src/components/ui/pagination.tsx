'use client'

import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const range = (page: number, count: number): (number | '…')[] => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const set = new Set([1, count, page - 1, page, page + 1])
  const out: (number | '…')[] = []
  let last = 0
  for (const n of [...set].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b)) {
    if (n - last > 1) out.push('…')
    out.push(n)
    last = n
  }
  return out
}

type Props = { page: number; pageCount: number; onChange: (p: number) => void; className?: string; id?: string }

export function Pagination({ page, pageCount, onChange, className, id = 'pg' }: Props) {
  if (pageCount <= 1) return null
  const nav = 'grid h-10 min-w-10 place-items-center rounded-[3px] border border-foreground/30 px-2 text-sm transition hover:-translate-y-0.5 hover:border-foreground disabled:pointer-events-none disabled:opacity-30'
  return (
    <nav aria-label="Pagination" className={cn('mt-10 flex flex-wrap items-center justify-center gap-2', className)}>
      <button className={nav} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      {range(page, pageCount).map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="label-mono px-1 text-muted-foreground">…</span>
        ) : (
          <button key={n} onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={cn(nav, 'relative', n === page && 'border-transparent text-accent-foreground')}>
            {n === page && <motion.span layoutId={id} className="absolute inset-0 rounded-[3px] bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span className="relative">{n}</span>
          </button>
        ),
      )}
      <button className={nav} disabled={page === pageCount} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </nav>
  )
}
