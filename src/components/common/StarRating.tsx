'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = { value: number; onChange?: (v: number) => void; size?: number; className?: string }

export default function StarRating({ value, onChange, size = 16, className }: Props) {
  return (
    <span className={cn('inline-flex gap-0.5', className)} role={onChange ? 'radiogroup' : 'img'} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <Star size={size} className={cn('transition', n <= value ? 'fill-accent text-accent' : 'text-foreground/25')} />
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={n === value} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)} className="transition hover:scale-125">{star}</button>
        ) : (
          <span key={n}>{star}</span>
        )
      })}
    </span>
  )
}
