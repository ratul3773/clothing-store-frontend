'use client'

import { settings } from '@/data/site'
import { saveSettings } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Field, Input } from '@/components/cms/ui'
import useDraft from '../_hooks/useDraft'
import { validateAccount } from '../_utils/settings.utils'
import SectionShell from './SectionShell'

export default function AccountSection() {
  const { toast } = useStore()
  const { draft, patch, dirty, reset, submitted, setSubmitted } = useDraft({ name: settings.admin.name, email: settings.admin.email, current: '', next: '', confirm: '' })
  const errors = validateAccount(draft, draft, settings.admin.password)
  const e = (k: string) => (submitted ? errors[k] : undefined)
  const save = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveSettings({ admin: { name: draft.name.trim(), email: draft.email.trim(), password: draft.next || settings.admin.password } })
    patch({ current: '', next: '', confirm: '' })
    setSubmitted(false)
    toast(draft.next ? 'Account saved and password changed' : 'Account saved')
  }
  return (
    <SectionShell title="Account & security" description="Administrator profile and password." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Admin name" error={e('name')}><Input value={draft.name} onChange={(x) => patch({ name: x.target.value })} /></Field>
        <Field label="Admin email" error={e('email')}><Input type="email" value={draft.email} onChange={(x) => patch({ email: x.target.value })} /></Field>
      </div>
      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
        <Field label="Current password" error={e('current')}><Input type="password" autoComplete="current-password" value={draft.current} onChange={(x) => patch({ current: x.target.value })} /></Field>
        <Field label="New password" error={e('next')}><Input type="password" autoComplete="new-password" value={draft.next} onChange={(x) => patch({ next: x.target.value })} /></Field>
        <Field label="Confirm new password" error={e('confirm')}><Input type="password" autoComplete="new-password" value={draft.confirm} onChange={(x) => patch({ confirm: x.target.value })} /></Field>
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Leave the password fields empty to keep your current password.</p>
    </SectionShell>
  )
}
