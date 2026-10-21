'use client'

import { useMemo, useState } from 'react'
import { products } from '@/data/catalog'
import { bdt } from '@/lib/utils'
import { Input } from '@/components/cms/ui'

type Props = { selected: string[]; onChange: (ids: string[]) => void; pct: number; conflicts: Record<string, string[]> }

export default function ProductPicker({ selected, onChange, pct, conflicts }: Props) {
  const [q, setQ] = useState('')
  const list = useMemo(
    () => products.filter((p) => (p.status === 'active' || selected.includes(p.id)) && `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())),
    [q, selected],
  )
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const valid = pct > 0 && pct <= 90
  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center gap-2 border-b border-border p-2">
        <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="shrink-0 text-xs text-muted-foreground">{selected.length} selected</span>
      </div>
      <ul className="max-h-60 divide-y divide-border overflow-y-auto">
        {list.map((p) => {
          const base = p.offer ?? p.price
          const on = selected.includes(p.id)
          return (
            <li key={p.id}>
              <label className="flex cursor-pointer items-center gap-3 px-3 py-1.5 text-[13px] hover:bg-muted/40">
                <input type="checkbox" checked={on} onChange={() => toggle(p.id)} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" className="size-8 rounded border border-border object-cover" />
                <span className="min-w-0 flex-1 truncate">
                  {p.name}
                  {conflicts[p.id] && <span className="ml-2 text-xs text-amber-600">Also in: {conflicts[p.id].join(', ')}</span>}
                </span>
                <span className="tabular-nums text-muted-foreground">{bdt(base)}</span>
                <span className="w-20 text-right font-medium tabular-nums">{on && valid ? bdt(Math.round(base * (1 - pct / 100))) : '-'}</span>
              </label>
            </li>
          )
        })}
        {list.length === 0 && <li className="px-3 py-6 text-center text-xs text-muted-foreground">No products found</li>}
      </ul>
    </div>
  )
}
