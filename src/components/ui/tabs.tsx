'use client'

import * as React from 'react'
import * as T from '@radix-ui/react-tabs'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export const Tabs = T.Root
export const TabsContent = ({ className, ...p }: React.ComponentProps<typeof T.Content>) => (
  <T.Content className={cn('mt-6 outline-none data-[state=active]:animate-[fadein_.4s_ease]', className)} {...p} />
)

export function TabsList({
  items,
  value,
  layoutId,
  className,
}: {
  items: { value: string; label: string; count?: number }[]
  value: string
  layoutId: string
  className?: string
}) {
  return (
    <T.List className={cn('flex gap-1 overflow-x-auto border-b border-border', className)}>
      {items.map((i) => (
        <T.Trigger
          key={i.value}
          value={i.value}
          className="label-mono relative shrink-0 px-4 py-3 text-muted-foreground transition-colors hover:text-foreground data-[state=active]:text-foreground"
        >
          {i.label}
          {i.count !== undefined && <span className="ml-1.5 text-accent">{i.count}</span>}
          {value === i.value && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-x-0 -bottom-px h-[3px] bg-accent"
              transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            />
          )}
        </T.Trigger>
      ))}
    </T.List>
  )
}
