'use client'

import { useState } from 'react'
import { saveCoupon } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import Modal from '@/components/cms/Modal'
import { Btn, Field, Input, Select } from '@/components/cms/ui'
import { couponToDraft, draftToCoupon, emptyCoupon, validateCoupon, type Coupon, type CouponDraft } from '../_utils/coupon.utils'

type Props = { open: boolean; onOpenChange: (o: boolean) => void; coupon: Coupon | null }

export default function CouponForm({ open, onOpenChange, coupon }: Props) {
  return open ? <Inner key={coupon?.code ?? 'new'} onOpenChange={onOpenChange} coupon={coupon} /> : null
}

function Inner({ onOpenChange, coupon }: Omit<Props, 'open'>) {
  const { toast } = useStore()
  const [d, setD] = useState<CouponDraft>(coupon ? couponToDraft(coupon) : emptyCoupon)
  const [submitted, setSubmitted] = useState(false)
  const errors = validateCoupon(d, coupon?.code)
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined)
  const set = <K extends keyof CouponDraft>(k: K, v: CouponDraft[K]) => setD((x) => ({ ...x, [k]: v }))

  const submit = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveCoupon(draftToCoupon(d), coupon?.code)
    toast(coupon ? 'Coupon updated' : 'Coupon created')
    onOpenChange(false)
  }

  return (
    <Modal open onOpenChange={onOpenChange} title={coupon ? `Edit ${coupon.code}` : 'New coupon'} footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" onClick={submit}>Save</Btn></>}>
      <div className="grid gap-4">
        <Field label="Code" error={err('code')}><Input className="font-mono uppercase" value={d.code} onChange={(e) => set('code', e.target.value.toUpperCase())} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type"><Select value={d.type} onChange={(e) => set('type', e.target.value as 'pct' | 'fix')}><option value="pct">Percentage (%)</option><option value="fix">Fixed amount (৳)</option></Select></Field>
          <Field label={d.type === 'pct' ? 'Value (%)' : 'Value (৳)'} error={err('value')}><Input type="number" min={0} value={d.value} onChange={(e) => set('value', e.target.value)} /></Field>
          <Field label="Minimum order (৳)" error={err('min')}><Input type="number" min={0} value={d.min} onChange={(e) => set('min', e.target.value)} /></Field>
          {d.type === 'pct' && <Field label="Max discount (৳)" hint="0 = no cap" error={err('max')}><Input type="number" min={0} value={d.max} onChange={(e) => set('max', e.target.value)} /></Field>}
        </div>
        <Field label="Note" hint="Shown to customers. Auto-generated if empty."><Input value={d.note} onChange={(e) => set('note', e.target.value)} /></Field>
      </div>
    </Modal>
  )
}
