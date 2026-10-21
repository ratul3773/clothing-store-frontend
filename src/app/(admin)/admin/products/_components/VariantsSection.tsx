'use client'

import { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Btn, Card, CardHeader, Input, Select } from '@/components/cms/ui'
import { SIZE_PRESETS } from '../_constants/products.constants'
import type { SectionProps } from './sectionProps'

export default function VariantsSection({ d, errors = {}, patch }: SectionProps) {
  const [size, setSize] = useState('')
  const addSize = () => {
    const s = size.trim().toUpperCase()
    if (s && !d.sizes.includes(s)) patch({ sizes: [...d.sizes, s] })
    setSize('')
  }
  const setColor = (i: number, p: Partial<(typeof d.colors)[number]>) => {
    const prev = d.colors[i]
    const next = d.colors.map((c, k) => (k === i ? { ...c, ...p } : c))
    // carry stock over when a color is renamed
    let stock = d.stock
    if (p.name !== undefined && p.name !== prev.name) {
      stock = {}
      Object.entries(d.stock).forEach(([k, v]) => {
        const [cn, sz] = k.split('|')
        stock[cn === prev.name ? `${p.name}|${sz}` : k] = v
      })
    }
    patch({ colors: next, stock })
  }
  return (
    <Card>
      <CardHeader title="Variants" description="Colors and sizes combine into the stock matrix." />
      <div className="space-y-5 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-foreground/80">Colors *</span>
            <Btn size="sm" onClick={() => patch({ colors: [...d.colors, { name: '', hex: '#888888', image: 0 }] })}><Plus className="size-3.5" />Add color</Btn>
          </div>
          <div className="space-y-2">
            {d.colors.map((c, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input type="color" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} aria-label="Color hex" className="h-8 w-10 cursor-pointer rounded border border-border bg-card p-0.5" />
                <Input className="w-40" placeholder="Color name" value={c.name} onChange={(e) => setColor(i, { name: e.target.value })} />
                <Input className="w-24 font-mono" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} aria-label="Hex" />
                <Select className="w-32" value={c.image} onChange={(e) => setColor(i, { image: Number(e.target.value) })} aria-label="Image">
                  {d.images.map((_, k) => <option key={k} value={k}>Image {k + 1}</option>)}
                </Select>
                <Btn size="icon" variant="ghost" className="text-red-600" aria-label="Remove color" disabled={d.colors.length <= 1} onClick={() => patch({ colors: d.colors.filter((_, k) => k !== i) })}><Trash2 className="size-4" /></Btn>
              </div>
            ))}
          </div>
          {errors.colors && <p className="mt-1 text-xs text-red-600">{errors.colors}</p>}
        </div>
        <div>
          <span className="mb-2 block text-xs font-medium text-foreground/80">Sizes *</span>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {d.sizes.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-xs font-medium">
                {s}
                <button type="button" aria-label={`Remove ${s}`} onClick={() => patch({ sizes: d.sizes.filter((x) => x !== s) })}><X className="size-3" /></button>
              </span>
            ))}
            {d.sizes.length === 0 && <span className="text-xs text-muted-foreground">No sizes yet.</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input className="w-28" placeholder="Add size" value={size} onChange={(e) => setSize(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())} />
            <Btn size="sm" onClick={addSize}>Add</Btn>
            <span className="text-xs text-muted-foreground">Presets:</span>
            <Btn size="sm" onClick={() => patch({ sizes: [...SIZE_PRESETS.SHIRT] })}>Shirt S-XXL</Btn>
            <Btn size="sm" onClick={() => patch({ sizes: [...SIZE_PRESETS.PANT] })}>Pant 30-38</Btn>
          </div>
          {errors.sizes && <p className="mt-1 text-xs text-red-600">{errors.sizes}</p>}
        </div>
      </div>
    </Card>
  )
}
