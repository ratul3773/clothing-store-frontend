'use client'

import useNow from '@/lib/useNow'
import { cn } from '@/lib/utils'

const pad = (n: number) => String(n).padStart(2, '0')

/** Live countdown to `endsAt`, ticking every second. */
export default function Countdown({ endsAt, className, tone = 'light' }: { endsAt: string; className?: string; tone?: 'light' | 'dark' }) {
  const now = useNow(1000)
  const left = now === null ? 0 : Math.max(0, Math.floor((+new Date(endsAt) - now) / 1000))
  const parts = [
    ['Days', Math.floor(left / 86400)],
    ['Hrs', Math.floor((left % 86400) / 3600)],
    ['Min', Math.floor((left % 3600) / 60)],
    ['Sec', left % 60],
  ] as const
  return (
    <div className={cn('flex items-center gap-2', className)} role="timer" aria-label="Time left">
      {parts.map(([l, v]) => (
        <div key={l} className={cn('min-w-14 rounded-[3px] px-2.5 py-2 text-center', tone === 'light' ? 'bg-background/10' : 'bg-foreground text-background')}>
          <p className="font-display text-3xl leading-none tabular-nums" suppressHydrationWarning>{pad(v)}</p>
          <p className="label-mono mt-1 text-[0.6rem] opacity-60">{l}</p>
        </div>
      ))}
    </div>
  )
}
