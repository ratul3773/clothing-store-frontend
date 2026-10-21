'use client'

import { Search } from 'lucide-react'
import { Btn, Input, Select, Toolbar } from '@/components/cms/ui'
import { LIFECYCLE, statusLabel } from '@/data/orders'
import { COURIERS, EMPTY_FILTERS, EXTRA_STATUSES, PAYMENTS, SOURCE_LABEL } from '@/app/(admin)/admin/orders/_constants/orders.constants'
import type { OrderFilters } from '@/app/(admin)/admin/orders/_types/orders.types'

export default function OrdersFilters({ value, onChange }: { value: OrderFilters; onChange: (v: OrderFilters) => void }) {
  const set = <K extends keyof OrderFilters>(k: K, v: OrderFilters[K]) => onChange({ ...value, [k]: v })
  const dirty = JSON.stringify(value) !== JSON.stringify(EMPTY_FILTERS)
  return (
    <Toolbar>
      <div className="relative min-w-52 flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search order ID, name or phone" value={value.q} onChange={(e) => set('q', e.target.value)} />
      </div>
      <Select className="w-40" value={value.status} onChange={(e) => set('status', e.target.value as OrderFilters['status'])} aria-label="Status">
        <option value="">All statuses</option>
        {[...LIFECYCLE, ...EXTRA_STATUSES].map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
      </Select>
      <Select className="w-36" value={value.source} onChange={(e) => set('source', e.target.value as OrderFilters['source'])} aria-label="Source">
        <option value="">All sources</option>
        {Object.entries(SOURCE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </Select>
      <Select className="w-32" value={value.payment} onChange={(e) => set('payment', e.target.value as OrderFilters['payment'])} aria-label="Payment">
        <option value="">All payments</option>
        {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
      </Select>
      <Select className="w-32" value={value.courier} onChange={(e) => set('courier', e.target.value as OrderFilters['courier'])} aria-label="Courier">
        <option value="">All couriers</option>
        {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
        <option value="none">Unassigned</option>
      </Select>
      <Input type="date" className="w-36" value={value.from} onChange={(e) => set('from', e.target.value)} aria-label="From date" />
      <Input type="date" className="w-36" value={value.to} onChange={(e) => set('to', e.target.value)} aria-label="To date" />
      {dirty && <Btn variant="ghost" onClick={() => onChange(EMPTY_FILTERS)}>Clear</Btn>}
    </Toolbar>
  )
}
