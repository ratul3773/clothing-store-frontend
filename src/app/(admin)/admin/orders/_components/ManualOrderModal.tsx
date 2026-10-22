'use client'

import { useEffect, useState } from 'react'
import { Btn, Field, Input, Select, Textarea } from '@/components/cms/ui'
import Modal from '@/components/cms/Modal'
import { useStore } from '@/components/providers/StoreProvider'
import { priceOf, products } from '@/data/catalog'
import { settings } from '@/data/site'
import { statusLabel } from '@/data/orders'
import { useNavigate } from '@/lib/nav'
import { bdt } from '@/lib/utils'
import { MANUAL_SOURCES, MANUAL_STATUSES, PAYMENTS, SOURCE_LABEL } from '@/app/(admin)/admin/orders/_constants/orders.constants'
import { validateManual, type Errors } from '@/app/(admin)/admin/orders/_schemas/order.schema'
import { adjustStock } from '@/app/(admin)/admin/orders/_services/orders.api'
import { holdsStock } from '@/app/(admin)/admin/orders/_utils/orders.utils'
import type { ManualDraft } from '@/app/(admin)/admin/orders/_types/orders.types'
import ManualOrderLines from '@/app/(admin)/admin/orders/_components/ManualOrderLines'

const blank = (): ManualDraft => ({ name: '', phone: '', address: '', zone: 'dhaka', source: 'ADMIN_MANUAL', payment: 'COD', paid: false, status: 'CONFIRMED', discount: '', deliveryOverride: '', lines: [] })

export default function ManualOrderModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { placeOrder, toast } = useStore()
  const go = useNavigate()
  const [d, setD] = useState<ManualDraft>(blank)
  const [errors, setErrors] = useState<Errors>({})
  useEffect(() => {
    if (open) { setD(blank()); setErrors({}) }
  }, [open])
  const set = <K extends keyof ManualDraft>(k: K, v: ManualDraft[K]) => setD((x) => ({ ...x, [k]: v }))

  const priced = d.lines.map((l) => {
    const p = products.find((x) => x.id === l.productId)!
    const col = p.colors.find((c) => c.name === l.color) ?? p.colors[0]
    return { productId: p.id, name: p.name, color: l.color, size: l.size, qty: l.qty, price: priceOf(p), image: p.images[col.image] }
  })
  const subtotal = priced.reduce((a, i) => a + i.price * i.qty, 0)
  const autoFee = subtotal === 0 || subtotal >= settings.delivery.freeAbove ? 0 : settings.delivery[d.zone]
  const delivery = d.deliveryOverride !== '' ? Number(d.deliveryOverride) || 0 : autoFee
  const discount = Math.min(Number(d.discount) || 0, subtotal)
  const total = Math.max(0, subtotal + delivery - discount)

  const submit = () => {
    const e = validateManual(d)
    setErrors(e)
    if (Object.keys(e).length) return
    const now = new Date().toISOString()
    const order = placeOrder({
      source: d.source, guest: true, status: d.status,
      customer: { name: d.name.trim(), phone: d.phone.trim(), address: d.address.trim(), zone: d.zone },
      items: priced, subtotal, delivery, discount, total, payment: d.payment, paid: d.paid,
      history: [{ status: d.status, at: now }],
    })
    if (holdsStock(d.status)) adjustStock({ items: priced }, -1)
    toast(`Order ${order.id} created`)
    onOpenChange(false)
    go(`/admin/orders/?id=${order.id}`)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      variant="drawer"
      title="Create manual order"
      description="Record an order taken by phone, chat or in person."
      footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" onClick={submit}>Create order</Btn></>}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Customer name" error={errors.name}><Input value={d.name} onChange={(e) => set('name', e.target.value)} /></Field>
          <Field label="Phone" error={errors.phone}><Input value={d.phone} onChange={(e) => set('phone', e.target.value)} placeholder="01XXX XXXXXX" /></Field>
        </div>
        <Field label="Address" error={errors.address}><Textarea className="min-h-16" value={d.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Delivery zone">
            <Select value={d.zone} onChange={(e) => set('zone', e.target.value as ManualDraft['zone'])}>
              <option value="dhaka">Dhaka</option>
              <option value="outside">Outside Dhaka</option>
            </Select>
          </Field>
          <Field label="Source">
            <Select value={d.source} onChange={(e) => set('source', e.target.value as ManualDraft['source'])}>
              {MANUAL_SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
            </Select>
          </Field>
        </div>
        <ManualOrderLines lines={d.lines} onChange={(l) => set('lines', l)} error={errors.lines} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Delivery fee (BDT)" error={errors.deliveryOverride} hint={`Auto: ${bdt(autoFee)}${subtotal >= settings.delivery.freeAbove ? ' (free delivery)' : ''}`}>
            <Input type="number" min={0} value={d.deliveryOverride} onChange={(e) => set('deliveryOverride', e.target.value)} placeholder={String(autoFee)} />
          </Field>
          <Field label="Discount (BDT)" error={errors.discount}><Input type="number" min={0} value={d.discount} onChange={(e) => set('discount', e.target.value)} /></Field>
          <Field label="Payment method">
            <Select value={d.payment} onChange={(e) => set('payment', e.target.value as ManualDraft['payment'])}>
              {PAYMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label="Initial status" hint="Confirmed orders deduct stock">
            <Select value={d.status} onChange={(e) => set('status', e.target.value as ManualDraft['status'])}>
              {MANUAL_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </Select>
          </Field>
        </div>
        <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={d.paid} onChange={(e) => set('paid', e.target.checked)} /> Payment already received</label>
        <dl className="space-y-1 rounded-md border border-border bg-muted/30 p-3 text-[13px]">
          <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{bdt(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Delivery</dt><dd className="tabular-nums">{bdt(delivery)}</dd></div>
          <div className="flex justify-between"><dt>Discount</dt><dd className="tabular-nums">-{bdt(discount)}</dd></div>
          <div className="flex justify-between border-t border-border pt-1 font-semibold"><dt>Total</dt><dd className="tabular-nums">{bdt(total)}</dd></div>
        </dl>
      </div>
    </Modal>
  )
}
