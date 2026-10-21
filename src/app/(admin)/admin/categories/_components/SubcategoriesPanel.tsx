'use client'

import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Btn, Input } from '@/components/cms/ui'
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { useStore } from '@/components/providers/StoreProvider'
import type { Taxon } from '@/data/catalog'
import { addSub, countProducts, removeSub, renameSubcategory } from '../_services/categories.api'
import { validateSubName } from '../_schemas/category.schema'

export default function SubcategoriesPanel({ t }: { t: Taxon }) {
  const { toast } = useStore()
  const [name, setName] = useState('')
  const [err, setErr] = useState<string>()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [del, setDel] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const add = () => {
    const e = validateSubName(name, t.subs)
    setErr(e)
    if (e) return
    addSub(t, name)
    setName('')
    toast('Subcategory added')
  }
  const rename = (from: string) => {
    const e = validateSubName(draft, t.subs, from)
    if (e) return setMsg(e)
    if (draft.trim() !== from) {
      renameSubcategory(t.cat, from, draft)
      toast('Subcategory renamed')
    }
    setEditing(null)
    setMsg(null)
  }

  return (
    <div className="p-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input placeholder="New subcategory name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
        </div>
        <Btn variant="primary" onClick={add}><Plus className="size-4" />Add</Btn>
      </div>
      {msg && <p className="mt-2 rounded bg-red-50 px-2 py-1.5 text-xs text-red-700">{msg}</p>}
      <ul className="mt-3 divide-y divide-border rounded-md border border-border">
        {t.subs.map((s) => (
          <li key={s} className="flex items-center gap-2 px-3 py-1.5 text-[13px]">
            {editing === s ? (
              <>
                <Input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && rename(s)} className="h-7" />
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Save" onClick={() => rename(s)}><Check className="size-3.5" /></Btn>
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Cancel" onClick={() => { setEditing(null); setMsg(null) }}><X className="size-3.5" /></Btn>
              </>
            ) : (
              <>
                <span className="flex-1">{s}</span>
                <span className="text-xs text-muted-foreground">{countProducts(t.cat, s)} products</span>
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Rename" onClick={() => { setEditing(s); setDraft(s); setMsg(null) }}><Pencil className="size-3.5" /></Btn>
                <Btn size="icon" variant="ghost" className="size-7 text-red-600" aria-label="Delete" onClick={() => {
                  const n = countProducts(t.cat, s)
                  if (n > 0) setMsg(`Cannot delete "${s}": ${n} product${n === 1 ? '' : 's'} use it. Reassign them first.`)
                  else { setMsg(null); setDel(s) }
                }}><Trash2 className="size-3.5" /></Btn>
              </>
            )}
          </li>
        ))}
        {t.subs.length === 0 && <li className="px-3 py-6 text-center text-xs text-muted-foreground">No subcategories yet.</li>}
      </ul>
      <AlertDialogText
        mode="normal"
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        title="Delete subcategory?"
        description={`"${del}" will be removed from ${t.label}.`}
        actionType="delete"
        onConfirm={() => {
          if (!del) return
          const e = removeSub(t, del)
          if (e) setMsg(e)
          else toast('Subcategory deleted')
        }}
      />
    </div>
  )
}
