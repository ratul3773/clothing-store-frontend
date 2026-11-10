'use client'
import { CmsButton } from "@/components/ui/button";
import { useWatch } from "react-hook-form";

import type { Customer } from '@/app/(admin)/admin/customers/_types/customer.types'
import { Badge } from '@/components/cms/ui';
import { FormField } from '@/components/common/form-field'
import { useStore } from '@/components/providers/StoreProvider'
import { patchCustomer } from '@/data/cms'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { customerNotesSchema } from '../_schemas/customer-notes.schema'

export default function CustomerNotes({ customer }: { customer: Customer }) {
  const { toast } = useStore()
  const form = useForm({ resolver: zodResolver(customerNotesSchema), defaultValues: { tag: '', note: customer.note } })
  const note = useWatch({ control: form.control, name: 'note' })

  const addTag = () => {
    const t = form.getValues('tag').trim()
    if (!t || customer.tags.some((x) => x.toLowerCase() === t.toLowerCase())) return form.resetField('tag')
    patchCustomer(customer.key, { tags: [...customer.tags, t] })
    form.resetField('tag')
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex flex-wrap gap-1">
          {customer.tags.length === 0 && <span className="text-xs text-muted-foreground">No tags</span>}
          {customer.tags.map((t) => (
            <Badge key={t} tone="blue" className="gap-1">
              {t}
              <button type="button" aria-label={`Remove ${t}`} onClick={() => patchCustomer(customer.key, { tags: customer.tags.filter((x) => x !== t) })}><X className="size-3" /></button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <FormField form={form} id="customer-tag" name="tag" label="Tags" isAdmin isInput placeholder="Add tag and press Enter" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
          <CmsButton variant="outline" onClick={addTag}>Add</CmsButton>
        </div>
      </div>
      <form onSubmit={form.handleSubmit(({ note }) => { patchCustomer(customer.key, { note: note.trim() }); form.reset({ tag: form.getValues('tag'), note: note.trim() }); toast('Note saved') })} noValidate className="space-y-4">
        <FormField form={form} id="customer-note" name="note" label="Internal note" description="Only visible to staff." isAdmin isTextArea />
        <CmsButton type="submit" variant="default" disabled={note === customer.note}>Save note</CmsButton>
      </form>
    </div>
  )
}
