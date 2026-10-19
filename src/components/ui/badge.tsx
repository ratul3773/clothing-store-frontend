'use client'

import { cn } from '@/lib/utils'

const tones: Record<string, string> = {
  NEW: 'bg-moss text-accent-foreground',
  SALE: 'bg-accent text-accent-foreground',
  'BEST SELLER': 'bg-foreground text-background',
  LIMITED: 'bg-card text-foreground border border-foreground',
  'LOW STOCK': 'bg-[#f3c64a] text-foreground',
  COMBO: 'bg-secondary text-foreground border border-foreground/40',
}

export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'label-mono inline-block rounded-[2px] px-2 py-1 leading-none',
        tones[children] ?? 'bg-muted text-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
