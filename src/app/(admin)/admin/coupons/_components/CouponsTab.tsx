'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { coupons } from '@/data/catalog'
import { deleteCoupon } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import DataTable from '@/components/cms/DataTable'
import { ConfirmDialog } from '@/components/cms/Modal'
import { Badge, Btn, Card, Empty } from '@/components/cms/ui'
import type { Coupon } from '../_utils/coupon.utils'
import CouponForm from './CouponForm'

export default function CouponsTab() {
  const { toast } = useStore()
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [del, setDel] = useState<Coupon | null>(null)
  const open = (c: Coupon | null) => { setEditing(c); setFormOpen(true) }
  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border p-3">
          <span className="text-xs text-muted-foreground">{coupons.length} coupon{coupons.length === 1 ? '' : 's'}</span>
          <Btn variant="primary" onClick={() => open(null)}><Plus className="size-4" />New coupon</Btn>
        </div>
        <DataTable
          rows={coupons}
          rowKey={(c) => c.code}
          onRowClick={open}
          empty={<Empty title="No coupons" description="Create a discount code for your customers." />}
          columns={[
            { key: 'code', header: 'Code', cell: (c) => <span className="font-mono text-xs font-semibold">{c.code}</span> },
            { key: 'type', header: 'Type', cell: (c) => <Badge tone={c.type === 'pct' ? 'blue' : 'violet'}>{c.type === 'pct' ? 'Percent' : 'Fixed'}</Badge> },
            { key: 'value', header: 'Value', cell: (c) => (c.type === 'pct' ? `${c.value}%` : bdt(c.value)) },
            { key: 'min', header: 'Min order', cell: (c) => (c.min ? bdt(c.min) : '-') },
            { key: 'max', header: 'Max discount', cell: (c) => (c.max ? bdt(c.max) : 'No cap') },
            { key: 'note', header: 'Note', cell: (c) => <span className="block max-w-xs truncate text-muted-foreground">{c.note}</span> },
            {
              key: 'act', header: '', align: 'right',
              cell: (c) => (
                <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Btn size="icon" variant="ghost" aria-label="Edit" onClick={() => open(c)}><Pencil className="size-4" /></Btn>
                  <Btn size="icon" variant="ghost" aria-label="Delete" onClick={() => setDel(c)}><Trash2 className="size-4 text-red-600" /></Btn>
                </span>
              ),
            },
          ]}
        />
      </Card>
      <CouponForm open={formOpen} onOpenChange={setFormOpen} coupon={editing} />
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Delete coupon" description={`Delete code ${del?.code}? Customers will no longer be able to use it.`} onConfirm={() => { if (del) { deleteCoupon(del.code); toast('Coupon deleted') } }} />
    </>
  )
}
