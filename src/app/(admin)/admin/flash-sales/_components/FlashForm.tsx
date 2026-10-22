'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { byId } from '@/data/catalog'
import { flashSales, type FlashSale } from '@/data/site'
import { saveFlash, uid } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import Modal from '@/components/cms/Modal'
import { Btn, Field, Input, Switch, Textarea } from '@/components/cms/ui'
import { findConflicts, fromLocalInput, toLocalInput, validateFlash, type FlashDraft } from '../_utils/flash.utils'
import ProductPicker from './ProductPicker'

type Props = { open: boolean; onOpenChange: (o: boolean) => void; sale: FlashSale | null; now: number }

const toDraft = (f: FlashSale | null, now: number): FlashDraft => {
  const start = f ? toLocalInput(f.startsAt) : toLocalInput(new Date(now).toISOString())
  const end = f ? toLocalInput(f.endsAt) : toLocalInput(new Date(now + 3 * 864e5).toISOString())
  return { title: f?.title ?? '', subtitle: f?.subtitle ?? '', discountPct: String(f?.discountPct ?? 10), enabled: f?.enabled ?? true, startsAt: start, endsAt: end, productIds: f?.productIds ?? [] }
}

export default function FlashForm({ open, onOpenChange, sale, now }: Props) {
  // key forces a fresh draft each time the dialog opens for another record
  return open ? <Inner key={sale?.id ?? 'new'} open onOpenChange={onOpenChange} sale={sale} now={now} /> : null
}

function Inner({ onOpenChange, sale, now }: Props) {
  const { toast } = useStore()
  const [d, setD] = useState<FlashDraft>(() => toDraft(sale, now))
  const [submitted, setSubmitted] = useState(false)
  const set = <K extends keyof FlashDraft>(k: K, v: FlashDraft[K]) => setD((x) => ({ ...x, [k]: v }))
  const errors = validateFlash(d)
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined)
  const conflicts = useMemo(() => findConflicts(d, flashSales.filter((f) => f.id !== sale?.id && f.enabled)), [d, sale])
  const pct = Number(d.discountPct)
  const nConf = Object.keys(conflicts).length

  const preview = d.productIds.slice(0, 4).map(byId).filter(Boolean)

  const submit = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveFlash({
      id: sale?.id ?? uid('f'),
      title: d.title.trim(),
      subtitle: d.subtitle.trim(),
      discountPct: pct,
      enabled: d.enabled,
      startsAt: fromLocalInput(d.startsAt),
      endsAt: fromLocalInput(d.endsAt),
      productIds: d.productIds,
    })
    toast(sale ? 'Flash sale updated' : 'Flash sale created')
    onOpenChange(false)
  }

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      size="lg"
      title={sale ? 'Edit flash sale' : 'New flash sale'}
      description="Discount applies on top of the current offer price while the campaign is live."
      footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" onClick={submit}>{sale ? 'Save changes' : 'Create campaign'}</Btn></>}
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <Field label="Title" error={err('title')}><Input value={d.title} onChange={(e) => set('title', e.target.value)} /></Field>
          <Field label="Discount %" error={err('discountPct')}><Input type="number" min={1} max={90} value={d.discountPct} onChange={(e) => set('discountPct', e.target.value)} /></Field>
        </div>
        <Field label="Subtitle"><Textarea rows={2} value={d.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Starts" error={err('startsAt')}><Input type="datetime-local" value={d.startsAt} onChange={(e) => set('startsAt', e.target.value)} /></Field>
          <Field label="Ends" error={err('endsAt')}><Input type="datetime-local" value={d.endsAt} onChange={(e) => set('endsAt', e.target.value)} /></Field>
        </div>
        <Switch checked={d.enabled} onChange={(v) => set('enabled', v)} label="Enabled" />
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Products</p>
          <ProductPicker selected={d.productIds} onChange={(ids) => set('productIds', ids)} pct={pct} conflicts={conflicts} />
          {err('productIds') && <p className="mt-1 text-xs text-red-600">{err('productIds')}</p>}
        </div>
        {nConf > 0 && (
          <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            {nConf} selected product{nConf > 1 ? 's are' : ' is'} already in another enabled campaign that overlaps these dates. Only the first live campaign applies.
          </div>
        )}
        {preview.length > 0 && pct > 0 && pct <= 90 && (
          <div>
            <p className="mb-1 text-xs font-medium text-foreground/80">Price preview</p>
            <div className="grid gap-2 sm:grid-cols-4">
              {preview.map((p) => {
                const base = p.offer ?? p.price
                return (
                  <div key={p.id} className="rounded-md border border-border p-2 text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt="" className="mb-1.5 aspect-square w-full rounded object-cover" />
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="tabular-nums"><span className="font-semibold text-red-600">{bdt(Math.round(base * (1 - pct / 100)))}</span> <span className="text-muted-foreground line-through">{bdt(base)}</span></p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
