'use client'

import * as React from 'react'
import * as A from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'

export const Accordion = A.Root

export function AccordionItem({ value, title, children }: { value: string; title: string; children: React.ReactNode }) {
  return (
    <A.Item value={value} className="border-b border-border">
      <A.Header>
        <A.Trigger className="group flex w-full items-center justify-between py-4 text-left font-semibold transition-colors hover:text-accent">
          {title}
          <Plus size={18} className="transition-transform duration-300 group-data-[state=open]:rotate-45" />
        </A.Trigger>
      </A.Header>
      <A.Content className="overflow-hidden text-sm leading-relaxed text-muted-foreground data-[state=closed]:animate-[acc-up_.3s_ease] data-[state=open]:animate-[acc-down_.35s_ease]">
        <div className="pb-4">{children}</div>
      </A.Content>
    </A.Item>
  )
}
