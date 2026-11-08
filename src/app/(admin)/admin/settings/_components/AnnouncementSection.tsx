'use client'

import { Btn } from '@/components/cms/ui'
import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { saveSettings } from '@/data/cms'
import { settings } from '@/data/site'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'
import useDraft from '../_hooks/useDraft'
import { announcementsSchema } from '../_schemas/settings.schema'
import SectionShell from './SectionShell'

export default function AnnouncementSection() {
  const { toast } = useStore()
  const { form, dirty, reset } = useDraft({ messages: settings.announcements.map((text) => ({ text })) }, zodResolver(announcementsSchema))
  const { fields, move, remove, append } = useFieldArray({ control: form.control, name: 'messages' })
  const save = form.handleSubmit((values) => {
    const messages = values.messages.map(({ text }) => ({ text: text.trim() }))
    saveSettings({ announcements: messages.map(({ text }) => text) })
    form.reset({ messages })
    toast('Announcement bar saved')
  })
  return (
    <SectionShell title="Announcement bar" description="Messages scrolling in the storefront header, in this order." dirty={dirty} onSave={save} onReset={reset}>
      <ul className="grid gap-2">
        {fields.map((field, i) => (
          <li key={field.id} className="flex items-center gap-2">
            <span className="w-5 text-right text-xs text-muted-foreground">{i + 1}</span>
            <FormField form={form} id={`announcement-${field.id}`} name={`messages.${i}.text`} isAdmin isInput label={`Message ${i + 1}`} className="flex-1" />
            <Btn size="icon" variant="ghost" aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}><ArrowUp className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Move down" disabled={i === fields.length - 1} onClick={() => move(i, i + 1)}><ArrowDown className="size-4" /></Btn>
            <Btn size="icon" variant="ghost" aria-label="Remove" onClick={() => remove(i)}><Trash2 className="size-4 text-red-600" /></Btn>
          </li>
        ))}
        {fields.length === 0 && <li className="text-xs text-muted-foreground">No messages. The announcement bar will be hidden or use defaults.</li>}
      </ul>
      <div><Btn onClick={() => append({ text: '' })}><Plus className="size-4" />Add message</Btn></div>
    </SectionShell>
  )
}
