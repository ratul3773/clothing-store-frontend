'use client'

import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import useDraft from '../_hooks/useDraft'
import { deliverySchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function DeliverySection() {
  const { toast } = useStore()
  const { form, draft, dirty, reset } = useDraft({ delivery: settings.delivery, payments: settings.payments }, zodResolver(deliverySchema))
  const { delivery, payments } = draft
  const save = form.handleSubmit(() => {
    saveSettings({ delivery: { ...delivery }, payments: { ...payments } })
    form.reset(draft)
    toast('Delivery & payment settings saved')
  })
  return (
    <SectionShell title="Delivery & payments" description="Shipping fees and accepted payment methods." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField form={form} id="DeliverySection-delivery.dhaka" name="delivery.dhaka" isAdmin isInput valueAsNumber label="Inside Dhaka fee (৳)" type="number" min={0} />
        <FormField form={form} id="DeliverySection-delivery.outside" name="delivery.outside" isAdmin isInput valueAsNumber label="Outside Dhaka fee (৳)" type="number" min={0} />
        <FormField form={form} id="DeliverySection-delivery.freeAbove" name="delivery.freeAbove" isAdmin isInput valueAsNumber label="Free delivery above (৳)" description="0 disables free delivery" type="number" min={0} />
      </div>
      <div className="grid gap-2">
        <p className="text-xs font-medium text-foreground/80">Payment methods</p>
        <FormField form={form} id="DeliverySection-payments.cod" name="payments.cod" isAdmin isSwitch label="Cash on delivery" />
        <FormField form={form} id="DeliverySection-payments.online" name="payments.online" isAdmin isSwitch label="Online payment (bKash, Nagad, card)" />
      </div>
    </SectionShell>
  )
}
