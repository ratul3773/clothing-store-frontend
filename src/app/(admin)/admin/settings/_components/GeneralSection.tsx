'use client'

import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Field, Input } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateStore } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function GeneralSection() {
  const { toast } = useStore()
  const { draft, patch, dirty, reset, submitted, setSubmitted } = useDraft(settings.store)
  const errors = validateStore(draft)
  const e = (k: string) => (submitted ? errors[k] : undefined)
  const save = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveSettings({ store: { ...draft, name: draft.name.trim() } })
    setSubmitted(false)
    toast('General settings saved')
  }
  return (
    <SectionShell title="General" description="Basic store identity and contact details." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Store name" error={e('name')}><Input value={draft.name} onChange={(x) => patch({ name: x.target.value })} /></Field>
        <Field label="Tagline"><Input value={draft.tagline} onChange={(x) => patch({ tagline: x.target.value })} /></Field>
        <Field label="Email" error={e('email')}><Input type="email" value={draft.email} onChange={(x) => patch({ email: x.target.value })} /></Field>
        <Field label="Phone" error={e('phone')}><Input value={draft.phone} onChange={(x) => patch({ phone: x.target.value })} /></Field>
        <Field label="WhatsApp number" hint="With country code, digits only" error={e('whatsapp')}><Input value={draft.whatsapp} onChange={(x) => patch({ whatsapp: x.target.value })} /></Field>
        <Field label="Address" error={e('address')}><Input value={draft.address} onChange={(x) => patch({ address: x.target.value })} /></Field>
      </div>
    </SectionShell>
  )
}
