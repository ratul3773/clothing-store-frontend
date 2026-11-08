'use client'

import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import useDraft from '../_hooks/useDraft'
import { accountSchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function AccountSection() {
  const { toast } = useStore()
  const { form, draft, dirty, reset } = useDraft({ name: settings.admin.name, email: settings.admin.email, current: '', next: '', confirm: '' }, zodResolver(accountSchema))
  const save = form.handleSubmit(() => {
    saveSettings({ admin: { name: draft.name.trim(), email: draft.email.trim(), password: draft.next || settings.admin.password } })
    form.reset({ ...draft, current: '', next: '', confirm: '' })
    toast(draft.next ? 'Account saved and password changed' : 'Account saved')
  })
  return (
    <SectionShell title="Account & security" description="Administrator profile and password." dirty={dirty} onSave={save} onReset={reset}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField form={form} id="AccountSection-name" name="name" isAdmin isInput label="Admin name" />
        <FormField form={form} id="AccountSection-email" name="email" isAdmin isInput label="Admin email" type="email" />
      </div>
      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
        <FormField form={form} id="AccountSection-current" name="current" isAdmin isInput label="Current password" type="password" autoComplete="current-password" />
        <FormField form={form} id="AccountSection-next" name="next" isAdmin isInput label="New password" type="password" autoComplete="new-password" />
        <FormField form={form} id="AccountSection-confirm" name="confirm" isAdmin isInput label="Confirm new password" type="password" autoComplete="new-password" />
      </div>
      <p className="-mt-2 text-xs text-muted-foreground">Leave the password fields empty to keep your current password.</p>
    </SectionShell>
  )
}
