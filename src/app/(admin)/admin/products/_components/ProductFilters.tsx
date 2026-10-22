'use client'

import { Search } from 'lucide-react'
import { Input, Select, Toolbar } from '@/components/cms/ui'
import { taxonomy } from '@/data/catalog'
import type { StatusFilter, StockFilter } from '../_types/products.types'

export type Filters = { q: string; cat: string; sub: string; status: StatusFilter; stock: StockFilter }
export const defaultFilters: Filters = { q: '', cat: '', sub: '', status: 'all', stock: 'all' }

export default function ProductFilters({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const subs = taxonomy.find((t) => t.cat === value.cat)?.subs ?? []
  const set = (p: Partial<Filters>) => onChange({ ...value, ...p })
  return (
    <Toolbar>
      <div className="relative min-w-52 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search name, SKU or slug" value={value.q} onChange={(e) => set({ q: e.target.value })} />
      </div>
      <Select className="w-40" value={value.cat} onChange={(e) => set({ cat: e.target.value, sub: '' })} aria-label="Category">
        <option value="">All categories</option>
        {taxonomy.map((t) => <option key={t.cat} value={t.cat}>{t.label}</option>)}
      </Select>
      <Select className="w-36" value={value.sub} disabled={!value.cat} onChange={(e) => set({ sub: e.target.value })} aria-label="Subcategory">
        <option value="">All subcategories</option>
        {subs.map((s) => <option key={s}>{s}</option>)}
      </Select>
      <Select className="w-32" value={value.status} onChange={(e) => set({ status: e.target.value as StatusFilter })} aria-label="Status">
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
      </Select>
      <Select className="w-32" value={value.stock} onChange={(e) => set({ stock: e.target.value as StockFilter })} aria-label="Stock">
        <option value="all">All stock</option>
        <option value="low">Low stock</option>
        <option value="out">Out of stock</option>
      </Select>
    </Toolbar>
  )
}
