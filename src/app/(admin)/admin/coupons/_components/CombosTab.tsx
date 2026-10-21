'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { combos, products, type Combo } from '@/data/catalog'
import { deleteCombo } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import DataTable from '@/components/cms/DataTable'
import { ConfirmDialog } from '@/components/cms/Modal'
import { Badge, Btn, Card, Empty } from '@/components/cms/ui'
import { partsTotal } from '../_utils/coupon.utils'
import ComboForm from './ComboForm'

export default function CombosTab() {
  const { toast } = useStore()
  const [editing, setEditing] = useState<Combo | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [del, setDel] = useState<Combo | null>(null)
  const open = (c: Combo | null) => { setEditing(c); setFormOpen(true) }
  return (
    <>
      <Card>
        <div className="flex items-center justify-between border-b border-border p-3">
          <span className="text-xs text-muted-foreground">{combos.length} combo{combos.length === 1 ? '' : 's'}</span>
          <Btn variant="primary" onClick={() => open(null)}><Plus className="size-4" />New combo</Btn>
        </div>
        <DataTable
          rows={combos}
          rowKey={(c) => c.id}
          onRowClick={open}
          empty={<Empty title="No combos" description="Bundle products into a discounted outfit." />}
          columns={[
            { key: 'name', header: 'Combo', cell: (c) => (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" className="size-10 rounded border border-border object-cover" />
                <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.tag}</p></div>
              </div>
            ) },
            { key: 'items', header: 'Products', cell: (c) => <span className="text-muted-foreground">{c.items.map((i) => products.find((p) => p.id === i.id)?.name ?? i.id).join(' + ')}</span> },
            { key: 'price', header: 'Combo price', cell: (c) => <span className="font-medium">{bdt(c.price)}</span> },
            { key: 'sum', header: 'Sum of parts', cell: (c) => bdt(partsTotal(c.items)) },
            { key: 'save', header: 'Savings', cell: (c) => { const s = partsTotal(c.items) - c.price; return <Badge tone={s > 0 ? 'green' : 'amber'}>{s > 0 ? `Save ${bdt(s)}` : 'No saving'}</Badge> } },
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
      <ComboForm open={formOpen} onOpenChange={setFormOpen} combo={editing} />
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Delete combo" description={`Delete "${del?.name}"?`} onConfirm={() => { if (del) { deleteCombo(del.id); toast('Combo deleted') } }} />
    </>
  )
}
