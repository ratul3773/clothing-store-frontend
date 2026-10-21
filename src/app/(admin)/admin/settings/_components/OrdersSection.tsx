'use client'

import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Field, Input, Switch } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateOrders } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function OrdersSection() {
  const { toast } = useStore()
  const { draft, patch, dirty, reset, submitted, setSubmitted } = useDraft(settings.orders)
  const errors = validateOrders(draft)
  const e = (k: string) => (submitted ? errors[k] : undefined)
  const num = (k: 'exchangeDays' | 'lowStock') => (x: React.ChangeEvent<HTMLInputElement>) => patch({ [k]: x.target.value === '' ? NaN : Number(x.target.value) })
  const val = (n: number) => (Number.isNaN(n) ? '' : n)
  const save = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveSettings({ orders: { ...draft, prefix: draft.prefix.toUpperCase() } })
    setSubmitted(false)
    toast('Order settings saved')
  }
  return (
    <SectionShell title="Orders" description="Order numbering, exchanges and inventory alerts." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Order ID prefix" hint={`Example: ${draft.prefix.toUpperCase() || 'MB'}-1042`} error={e('prefix')}><Input value={draft.prefix} maxLength={6} onChange={(x) => patch({ prefix: x.target.value })} /></Field>
        <Field label="Exchange window (days)" error={e('exchangeDays')}><Input type="number" min={0} value={val(draft.exchangeDays)} onChange={num('exchangeDays')} /></Field>
        <Field label="Low-stock threshold" hint="Flag variants at or below this" error={e('lowStock')}><Input type="number" min={0} value={val(draft.lowStock)} onChange={num('lowStock')} /></Field>
      </div>
      <Switch checked={draft.autoConfirm} onChange={(v) => patch({ autoConfirm: v })} label="Auto-confirm new orders" />
    </SectionShell>
  )
}
