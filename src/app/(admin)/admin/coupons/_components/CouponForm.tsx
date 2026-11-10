'use client'
import { CmsButton } from "@/components/ui/button";
import { useWatch } from "react-hook-form";

import { FormField } from '@/components/common/form-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { couponFormSchema } from '../_schemas/coupon.schema'

import Modal from '@/components/cms/Modal'

import { useStore } from '@/components/providers/StoreProvider'
import { saveCoupon } from '@/data/cms'
import { couponToDraft, draftToCoupon, emptyCoupon, type Coupon, type CouponDraft } from '../_utils/coupon.utils'

type Props = { open: boolean; onOpenChange: (o: boolean) => void; coupon: Coupon | null }

export default function CouponForm({ open, onOpenChange, coupon }: Props) {
  return open ? <Inner key={coupon?.code ?? 'new'} onOpenChange={onOpenChange} coupon={coupon} /> : null
}

function Inner({ onOpenChange, coupon }: Omit<Props, 'open'>) {
  const { toast } = useStore()
  const form = useForm<CouponDraft>({ resolver: zodResolver(couponFormSchema(coupon?.code)), defaultValues: coupon ? couponToDraft(coupon) : emptyCoupon })
  const d = useWatch({ control: form.control, compute: (values) => values })

  const submit = form.handleSubmit(() => {
    saveCoupon(draftToCoupon(d), coupon?.code)
    toast(coupon ? 'Coupon updated' : 'Coupon created')
    onOpenChange(false)
  })

  return (
    <Modal open onOpenChange={onOpenChange} title={coupon ? `Edit ${coupon.code}` : 'New coupon'} footer={<><CmsButton variant="outline" onClick={() => onOpenChange(false)}>Cancel</CmsButton><CmsButton variant="default" type="submit" form="coupon-form">Save</CmsButton></>}>
      <form id="coupon-form" onSubmit={submit} noValidate className="grid gap-4">
        <FormField form={form} id="coupon-code" name="code" isAdmin isInput label="Code" className="font-mono uppercase" onValueChange={(value) => form.setValue('code', value.toUpperCase(), { shouldDirty: true })} />
        <div className="grid grid-cols-2 gap-4">
          <FormField form={form} id="coupon-type" name="type" isAdmin isSelect label="Type" options={[{ value: "pct", label: "Percentage (%)" }, { value: "fix", label: "Fixed amount (৳)" }]} />
          <FormField form={form} id="coupon-value" name="value" isAdmin isInput label={d.type === 'pct' ? 'Value (%)' : 'Value (৳)'} type="number" min={0} />
          <FormField form={form} id="coupon-min" name="min" isAdmin isInput label="Minimum order (৳)" type="number" min={0} />
          {d.type === 'pct' && <FormField form={form} id="coupon-max" name="max" isAdmin isInput label="Max discount (৳)" description="0 = no cap" type="number" min={0} />}
        </div>
        <FormField form={form} id="coupon-note" name="note" isAdmin isInput label="Note" description="Shown to customers. Auto-generated if empty." />
      </form>
    </Modal>
  )
}
