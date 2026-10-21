'use client'

import { useState } from 'react'
import Modal from '@/components/cms/Modal'
import ImageField from '@/components/cms/ImageField'
import { Btn, Field, Input, Textarea } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { taxonomy } from '@/data/catalog'
import { slugify } from '@/data/cms'
import { createCategory, updateCategory } from '../_services/categories.api'
import { validateCategory } from '../_schemas/category.schema'
import type { CategoryDraft } from '../_types/categories.types'

type Props = { open: boolean; prev?: string; onClose: () => void; onSaved: (cat: string) => void }

export default function CategoryModal({ open, prev, onClose, onSaved }: Props) {
  // remount the form each time the modal opens so state resets
  return (
    <Modal open={open} onOpenChange={(o) => !o && onClose()} title={prev ? 'Edit category' : 'New category'}>
      {open && <CategoryForm key={prev ?? 'new'} prev={prev} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  )
}

function CategoryForm({ prev, onClose, onSaved }: Omit<Props, 'open'>) {
  const { toast } = useStore()
  const existing = taxonomy.find((t) => t.cat === prev)
  const [d, setD] = useState<CategoryDraft>({ cat: existing?.cat ?? '', label: existing?.label ?? '', blurb: existing?.blurb ?? '', image: existing?.image ?? '', keyTouched: !!existing })
  const [tried, setTried] = useState(false)
  const errors = tried ? validateCategory(d, taxonomy, prev) : {}
  const patch = (p: Partial<CategoryDraft>) => setD((x) => ({ ...x, ...p }))

  const save = () => {
    setTried(true)
    if (Object.keys(validateCategory(d, taxonomy, prev)).length) return
    const t = { cat: d.cat, label: d.label.trim(), blurb: d.blurb.trim(), image: d.image, subs: existing?.subs ?? [] }
    if (existing && prev) updateCategory(t, prev)
    else createCategory(t)
    toast(existing ? 'Category saved' : 'Category created')
    onSaved(t.cat)
    onClose()
  }

  return (
    <div className="space-y-4">
      <Field label="Label *" error={errors.label}>
        <Input value={d.label} onChange={(e) => patch({ label: e.target.value, ...(d.keyTouched ? {} : { cat: slugify(e.target.value) }) })} />
      </Field>
      <Field label="Key (slug) *" error={errors.cat} hint={existing && d.cat !== prev ? "Renaming the key moves all of this category's products to the new key." : 'Used in URLs and to link products.'}>
        <Input value={d.cat} onChange={(e) => patch({ cat: slugify(e.target.value), keyTouched: true })} className="font-mono" />
      </Field>
      <Field label="Blurb"><Textarea rows={3} value={d.blurb} onChange={(e) => patch({ blurb: e.target.value })} /></Field>
      <div>
        <span className="mb-1 block text-xs font-medium text-foreground/80">Image</span>
        <ImageField value={d.image} onChange={(image) => patch({ image })} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" onClick={save}>Save category</Btn>
      </div>
    </div>
  )
}
