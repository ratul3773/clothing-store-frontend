'use client'
import { useWatch } from "react-hook-form";

import { FormField } from '@/components/common/form-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { flashFormSchema } from '../_schemas/flash.schema'

import Modal from '@/components/cms/Modal'
import { Btn } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { byId } from '@/data/catalog'
import { saveFlash, uid } from '@/data/cms'
import { flashSales, type FlashSale } from '@/data/site'
import { bdt } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'
import { findConflicts, fromLocalInput, toLocalInput, type FlashDraft } from '../_utils/flash.utils'
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
  const form = useForm<FlashDraft>({ resolver: zodResolver(flashFormSchema), defaultValues: toDraft(sale, now) })
  const d = useWatch({ control: form.control, compute: (values) => values })
  const err = (key: keyof FlashDraft) => form.formState.errors[key]?.message
  const conflicts = useMemo(() => findConflicts(d, flashSales.filter((f) => f.id !== sale?.id && f.enabled)), [d, sale])
  const pct = Number(d.discountPct)
  const nConf = Object.keys(conflicts).length

  const preview = d.productIds.slice(0, 4).map(byId).filter(Boolean)

  const submit = form.handleSubmit(() => {
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
  })

  return (
    <Modal
      open
      onOpenChange={onOpenChange}
      size="lg"
      title={sale ? 'Edit flash sale' : 'New flash sale'}
      description="Discount applies on top of the current offer price while the campaign is live."
      footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" type="submit" form="flash-form">{sale ? 'Save changes' : 'Create campaign'}</Btn></>}
    >
      <form id="flash-form" onSubmit={submit} noValidate className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <FormField form={form} id="flash-title" name="title" isAdmin isInput label="Title" />
          <FormField form={form} id="flash-discountPct" name="discountPct" isAdmin isInput label="Discount %" type="number" min={1} max={90} />
        </div>
        <FormField form={form} id="flash-subtitle" name="subtitle" isAdmin isTextArea label="Subtitle" rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField form={form} id="flash-startsAt" name="startsAt" isAdmin isInput label="Starts" type="datetime-local" />
          <FormField form={form} id="flash-endsAt" name="endsAt" isAdmin isInput label="Ends" type="datetime-local" />
        </div>
        <FormField form={form} id="flash-enabled" name="enabled" isAdmin isSwitch label="Enabled" />
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Products</p>
          <ProductPicker selected={d.productIds} onChange={(ids) => form.setValue('productIds', ids, { shouldDirty: true, shouldValidate: form.formState.isSubmitted })} pct={pct} conflicts={conflicts} />
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
                    <Image width={240} height={240} src={p.images[0]} alt="" className="mb-1.5 aspect-square h-auto w-full rounded object-cover" />
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="tabular-nums"><span className="font-semibold text-red-600">{bdt(Math.round(base * (1 - pct / 100)))}</span> <span className="text-muted-foreground line-through">{bdt(base)}</span></p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
