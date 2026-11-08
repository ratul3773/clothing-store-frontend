'use client'

import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import useDraft from '../_hooks/useDraft'
import { seoSchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function SeoSection() {
  const { toast } = useStore()
  const { form, draft, dirty, reset } = useDraft({ seo: settings.seo, social: settings.social }, zodResolver(seoSchema))
  const { seo, social } = draft
  const save = form.handleSubmit(() => {
    saveSettings({ seo: { ...seo }, social: { ...social } })
    form.reset(draft)
    toast('SEO & social saved')
  })
  return (
    <SectionShell title="SEO & social" description="Search engine metadata and social profiles." dirty={dirty} onSave={save} onReset={reset}>
      <FormField form={form} id="SeoSection-seo.title" name="seo.title" isAdmin isInput label="Meta title" description={`${seo.title.length}/70`} />
      <FormField form={form} id="SeoSection-seo.description" name="seo.description" isAdmin isTextArea label="Meta description" description={`${seo.description.length}/170`} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField form={form} id="SeoSection-social.facebook" name="social.facebook" isAdmin isInput label="Facebook URL" />
        <FormField form={form} id="SeoSection-social.instagram" name="social.instagram" isAdmin isInput label="Instagram URL" />
      </div>
    </SectionShell>
  )
}
