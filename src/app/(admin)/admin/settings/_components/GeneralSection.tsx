'use client'

import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import useDraft from '../_hooks/useDraft'
import { storeSchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function GeneralSection() {
  const { toast } = useStore()
  const { form, draft, dirty, reset } = useDraft(settings.store, zodResolver(storeSchema))
  const save = form.handleSubmit(() => {
    saveSettings({ store: { ...draft, name: draft.name.trim() } })
    form.reset(draft)
    toast('General settings saved')
  })
  return (
    <SectionShell title="General" description="Basic store identity and contact details." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField form={form} id="GeneralSection-name" name="name" isAdmin isInput label="Store name" />
        <FormField form={form} id="GeneralSection-tagline" name="tagline" isAdmin isInput label="Tagline" />
        <FormField form={form} id="GeneralSection-email" name="email" isAdmin isInput label="Email" type="email" />
        <FormField form={form} id="GeneralSection-phone" name="phone" isAdmin isInput label="Phone" />
        <FormField form={form} id="GeneralSection-whatsapp" name="whatsapp" isAdmin isInput label="WhatsApp number" description="With country code, digits only" />
        <FormField form={form} id="GeneralSection-address" name="address" isAdmin isInput label="Address" />
      </div>
    </SectionShell>
  )
}
