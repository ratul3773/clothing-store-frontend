'use client'

import { useState } from 'react'
import { Card, CardHeader, Input } from '@/components/cms/ui'
import type { Product } from '@/data/catalog'
import { cn } from '@/lib/utils'
import type { SectionProps } from './sectionProps'

export default function LookSection({ d, others, patch }: SectionProps & { others: Product[] }) {
  const [q, setQ] = useState('')
  const list = others.filter((p) => p.status === 'active' && p.name.toLowerCase().includes(q.toLowerCase()))
  const toggle = (id: string) => patch({ look: d.look.includes(id) ? d.look.filter((x) => x !== id) : [...d.look, id] })
  return (
    <Card>
      <CardHeader title="Complete the look" description={`${d.look.length} selected. Shown as suggested pairings on the product page.`} />
      <div className="space-y-2 p-4">
        <Input placeholder="Search active products" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="grid max-h-64 gap-1.5 overflow-y-auto sm:grid-cols-2">
          {list.map((p) => {
            const on = d.look.includes(p.id)
            return (
              <label key={p.id} className={cn('flex cursor-pointer items-center gap-2 rounded border p-1.5 text-[13px]', on ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted')}>
                <input type="checkbox" checked={on} onChange={() => toggle(p.id)} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" className="size-8 rounded object-cover" />
                <span className="truncate">{p.name}</span>
              </label>
            )
          })}
          {list.length === 0 && <p className="text-xs text-muted-foreground">No matching active products.</p>}
        </div>
      </div>
    </Card>
  )
}
