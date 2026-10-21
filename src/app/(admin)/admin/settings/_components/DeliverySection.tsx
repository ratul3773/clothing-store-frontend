'use client'

import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Field, Input, Switch } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateDelivery } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function DeliverySection() {
  const { toast } = useStore()
  const { draft, setDraft, dirty, reset, submitted, setSubmitted } = useDraft({ delivery: settings.delivery, payments: settings.payments })
  const { delivery, payments } = draft
  const errors = validateDelivery(delivery, payments)
  const e = (k: string) => (submitted ? errors[k] : undefined)
  const num = (k: 'dhaka' | 'outside' | 'freeAbove') => (x: React.ChangeEvent<HTMLInputElement>) => setDraft((d) => ({ ...d, delivery: { ...d.delivery, [k]: x.target.value === '' ? NaN : Number(x.target.value) } }))
  const pay = (k: 'cod' | 'online') => (v: boolean) => setDraft((d) => ({ ...d, payments: { ...d.payments, [k]: v } }))
  const save = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveSettings({ delivery: { ...delivery }, payments: { ...payments } })
    setSubmitted(false)
    toast('Delivery & payment settings saved')
  }
  const val = (n: number) => (Number.isNaN(n) ? '' : n)
  return (
    <SectionShell title="Delivery & payments" description="Shipping fees and accepted payment methods." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Inside Dhaka fee (৳)" error={e('dhaka')}><Input type="number" min={0} value={val(delivery.dhaka)} onChange={num('dhaka')} /></Field>
        <Field label="Outside Dhaka fee (৳)" error={e('outside')}><Input type="number" min={0} value={val(delivery.outside)} onChange={num('outside')} /></Field>
        <Field label="Free delivery above (৳)" hint="0 disables free delivery" error={e('freeAbove')}><Input type="number" min={0} value={val(delivery.freeAbove)} onChange={num('freeAbove')} /></Field>
      </div>
      <div className="grid gap-2">
        <p className="text-xs font-medium text-foreground/80">Payment methods</p>
        <Switch checked={payments.cod} onChange={pay('cod')} label="Cash on delivery" />
        <Switch checked={payments.online} onChange={pay('online')} label="Online payment (bKash, Nagad, card)" />
        {e('payments') && <p className="text-xs text-red-600">{e('payments')}</p>}
      </div>
    </SectionShell>
  )
}
