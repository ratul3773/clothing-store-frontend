'use client'

import { useState } from 'react'
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { flashSales, type FlashSale } from '@/data/site'
import { deleteFlash, saveFlash, uid } from '@/data/cms'
import { useCms } from '@/lib/useCms'
import useNow from '@/lib/useNow'
import { useStore } from '@/components/providers/StoreProvider'
import DataTable from '@/components/cms/DataTable'
import { ConfirmDialog } from '@/components/cms/Modal'
import { Badge, Btn, Card, Empty, PageHeader, StatCard, Switch } from '@/components/cms/ui'
import { countdown, flashStatus, fmtDate, statusTone } from '../_utils/flash.utils'
import FlashForm from './FlashForm'

export default function FlashSalesView() {
  useCms()
  const { toast } = useStore()
  const now = useNow(30_000)
  const [editing, setEditing] = useState<FlashSale | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formNow, setFormNow] = useState<number | null>(null)
  const [del, setDel] = useState<FlashSale | null>(null)

  if (now === null) {
    return (
      <div className="space-y-4">
        <PageHeader title="Flash sales" description="Time-limited discounts applied to selected products." crumbs={['Admin', 'Flash sales']} />
        <p className="text-sm text-muted-foreground" role="status">Loading flash sales...</p>
      </div>
    )
  }

  const live = flashSales.filter((f) => flashStatus(f, now) === 'Live')
  const scheduled = flashSales.filter((f) => flashStatus(f, now) === 'Scheduled').length
  const onSale = new Set(live.flatMap((f) => f.productIds)).size

  const open = (f: FlashSale | null) => { setEditing(f); setFormNow(Date.now()); setFormOpen(true) }
  const duplicate = (f: FlashSale) => {
    saveFlash({ ...f, id: uid('f'), title: `${f.title} (copy)`, enabled: false, productIds: [...f.productIds] })
    toast('Campaign duplicated (disabled)')
  }

  return (
    <>
      <PageHeader title="Flash sales" description="Time-limited discounts applied to selected products." crumbs={['Admin', 'Flash sales']} actions={<Btn variant="primary" onClick={() => open(null)}><Plus className="size-4" />New campaign</Btn>} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Live now" value={live.length} />
        <StatCard label="Scheduled" value={scheduled} />
        <StatCard label="Products on sale" value={onSale} />
      </div>
      <Card>
        <DataTable
          rows={flashSales}
          rowKey={(f) => f.id}
          onRowClick={(f) => open(f)}
          empty={<Empty title="No flash sales yet" description="Create a campaign to discount products for a limited time." action={<Btn variant="primary" onClick={() => open(null)}>New campaign</Btn>} />}
          columns={[
            { key: 'title', header: 'Campaign', cell: (f) => <div><p className="font-medium">{f.title}</p><p className="max-w-xs truncate text-xs text-muted-foreground">{f.subtitle}</p></div> },
            { key: 'status', header: 'Status', cell: (f) => { const s = flashStatus(f, now); return <Badge tone={statusTone[s]}>{s}</Badge> } },
            { key: 'pct', header: 'Discount', cell: (f) => `${f.discountPct}%` },
            { key: 'n', header: 'Products', cell: (f) => f.productIds.length },
            { key: 'start', header: 'Start', cell: (f) => fmtDate(f.startsAt) },
            { key: 'end', header: 'End', cell: (f) => fmtDate(f.endsAt) },
            { key: 'cd', header: 'Countdown', cell: (f) => <span className="text-muted-foreground">{countdown(f, now)}</span> },
            { key: 'on', header: 'Enabled', cell: (f) => <span onClick={(e) => e.stopPropagation()}><Switch checked={f.enabled} onChange={(v) => { saveFlash({ ...f, enabled: v }); toast(v ? 'Campaign enabled' : 'Campaign disabled') }} /></span> },
            {
              key: 'act', header: '', align: 'right',
              cell: (f) => (
                <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Btn size="icon" variant="ghost" aria-label="Edit" onClick={() => open(f)}><Pencil className="size-4" /></Btn>
                  <Btn size="icon" variant="ghost" aria-label="Duplicate" onClick={() => duplicate(f)}><Copy className="size-4" /></Btn>
                  <Btn size="icon" variant="ghost" aria-label="Delete" onClick={() => setDel(f)}><Trash2 className="size-4 text-red-600" /></Btn>
                </span>
              ),
            },
          ]}
        />
      </Card>
      <FlashForm open={formOpen} onOpenChange={setFormOpen} sale={editing} now={formNow ?? now} />
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Delete flash sale" description={`Delete "${del?.title}"? Product prices return to normal immediately.`} onConfirm={() => { if (del) { deleteFlash(del.id); toast('Campaign deleted') } }} />
    </>
  )
}
