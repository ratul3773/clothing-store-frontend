'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Btn, Input } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { getSizeChart, saveSizeChart } from '../_services/categories.api'
import type { SizeRow } from '../_types/categories.types'

export default function SizeChartEditor({ cat }: { cat: string }) {
  const { toast } = useStore()
  const [rows, setRows] = useState<SizeRow[]>(() => getSizeChart(cat).map((r) => ({ ...r })))
  const [error, setError] = useState<string>()
  const set = (i: number, p: Partial<SizeRow>) => setRows((r) => r.map((x, k) => (k === i ? { ...x, ...p } : x)))

  const save = () => {
    const sizes = rows.map((r) => r.size.trim()).filter(Boolean)
    if (rows.some((r) => !r.size.trim())) return setError('Every row needs a size label (or remove the row).')
    if (new Set(sizes.map((s) => s.toLowerCase())).size !== sizes.length) return setError('Size labels must be unique.')
    setError(undefined)
    saveSizeChart(cat, rows)
    toast('Size chart saved')
  }

  return (
    <div className="p-4">
      <p className="mb-2 text-xs text-muted-foreground">Shown on product pages. Columns: size, chest/waist, length/hip, sleeve/rise.</p>
      <div className="space-y-1.5">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-1.5 text-xs font-medium text-muted-foreground">
          <span>Size</span><span>A</span><span>B</span><span>C</span><span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-1.5">
            <Input value={r.size} onChange={(e) => set(i, { size: e.target.value })} aria-label="Size" />
            <Input value={r.a} onChange={(e) => set(i, { a: e.target.value })} aria-label="A" />
            <Input value={r.b} onChange={(e) => set(i, { b: e.target.value })} aria-label="B" />
            <Input value={r.c} onChange={(e) => set(i, { c: e.target.value })} aria-label="C" />
            <Btn size="icon" variant="ghost" className="size-8 text-red-600" aria-label="Remove row" onClick={() => setRows((x) => x.filter((_, k) => k !== i))}><Trash2 className="size-3.5" /></Btn>
          </div>
        ))}
        {rows.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">No rows. Add one to create a chart.</p>}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex justify-between">
        <Btn size="sm" onClick={() => setRows((x) => [...x, { size: '', a: '', b: '', c: '' }])}><Plus className="size-3.5" />Add row</Btn>
        <Btn variant="primary" onClick={save}>Save size chart</Btn>
      </div>
    </div>
  )
}
