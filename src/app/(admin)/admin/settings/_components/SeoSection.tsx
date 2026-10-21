'use client'

import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Field, Input, Textarea } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateSeo } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function SeoSection() {
  const { toast } = useStore()
  const { draft, setDraft, dirty, reset, submitted, setSubmitted } = useDraft({ seo: settings.seo, social: settings.social })
  const { seo, social } = draft
  const errors = validateSeo(seo, social)
  const e = (k: string) => (submitted ? errors[k] : undefined)
  const setSeo = (p: Partial<typeof seo>) => setDraft((d) => ({ ...d, seo: { ...d.seo, ...p } }))
  const setSocial = (p: Partial<typeof social>) => setDraft((d) => ({ ...d, social: { ...d.social, ...p } }))
  const save = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveSettings({ seo: { ...seo }, social: { ...social } })
    setSubmitted(false)
    toast('SEO & social saved')
  }
  return (
    <SectionShell title="SEO & social" description="Search engine metadata and social profiles." dirty={dirty} onSave={save} onReset={reset}>
      <Field label="Meta title" hint={`${seo.title.length}/70`} error={e('title')}><Input value={seo.title} onChange={(x) => setSeo({ title: x.target.value })} /></Field>
      <Field label="Meta description" hint={`${seo.description.length}/170`} error={e('description')}><Textarea rows={3} value={seo.description} onChange={(x) => setSeo({ description: x.target.value })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Facebook URL" error={e('facebook')}><Input value={social.facebook} onChange={(x) => setSocial({ facebook: x.target.value })} /></Field>
        <Field label="Instagram URL" error={e('instagram')}><Input value={social.instagram} onChange={(x) => setSocial({ instagram: x.target.value })} /></Field>
      </div>
    </SectionShell>
  )
}
