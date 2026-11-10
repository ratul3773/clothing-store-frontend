'use client'

import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import useDraft from '../_hooks/useDraft'
import { ordersSchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function OrdersSection() {
  const { toast } = useStore()
  const { form, draft, dirty, reset } = useDraft(settings.orders, zodResolver(ordersSchema))
  const save = form.handleSubmit(() => {
    saveSettings({ orders: { ...draft, prefix: draft.prefix.toUpperCase() } })
    form.reset(draft)
    toast('Order settings saved')
  })
  return (
    <SectionShell title="Orders" description="Order numbering, exchanges and inventory alerts." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField form={form} id="OrdersSection-prefix" name="prefix" isAdmin isInput label="Order ID prefix" description={`Example: ${draft.prefix.toUpperCase() || 'MB'}-1042`} maxLength={6} />
        <FormField form={form} id="OrdersSection-exchangeDays" name="exchangeDays" isAdmin isInput valueAsNumber label="Exchange window (days)" type="number" min={0} />
        <FormField form={form} id="OrdersSection-lowStock" name="lowStock" isAdmin isInput valueAsNumber label="Low-stock threshold" description="Flag variants at or below this" type="number" min={0} />
      </div>
      <FormField form={form} id="OrdersSection-autoConfirm" name="autoConfirm" isAdmin isSwitch label="Auto-confirm new orders" />
    </SectionShell>
  )
}
