'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { patchCustomer } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { Badge, Btn, Field, Input, Textarea } from '@/components/cms/ui'
import type { Customer } from '@/app/(admin)/admin/customers/_types/customer.types'

export default function CustomerNotes({ customer }: { customer: Customer }) {
  const { toast } = useStore()
  const [tag, setTag] = useState('')
  const [note, setNote] = useState(customer.note)

  const addTag = () => {
    const t = tag.trim()
    if (!t || customer.tags.some((x) => x.toLowerCase() === t.toLowerCase())) return setTag('')
    patchCustomer(customer.key, { tags: [...customer.tags, t] })
    setTag('')
  }

  return (
    <div className="space-y-4">
      <Field label="Tags">
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
          <Input value={tag} placeholder="Add tag and press Enter" onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
          <Btn onClick={addTag}>Add</Btn>
        </div>
      </Field>
      <Field label="Internal note" hint="Only visible to staff.">
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <Btn variant="primary" disabled={note === customer.note} onClick={() => { patchCustomer(customer.key, { note: note.trim() }); toast('Note saved') }}>Save note</Btn>
    </div>
  )
}
