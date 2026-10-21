'use client'

import { useState } from 'react'
import { products, type Combo } from '@/data/catalog'
import { saveCombo, uid } from '@/data/cms'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import Modal from '@/components/cms/Modal'
import ImageField from '@/components/cms/ImageField'
import { Btn, Field, Input, Select } from '@/components/cms/ui'
import { comboToDraft, emptyCombo, partsTotal, validateCombo, type ComboDraft } from '../_utils/coupon.utils'

type Props = { open: boolean; onOpenChange: (o: boolean) => void; combo: Combo | null }

export default function ComboForm({ open, onOpenChange, combo }: Props) {
  return open ? <Inner key={combo?.id ?? 'new'} onOpenChange={onOpenChange} combo={combo} /> : null
}

function Inner({ onOpenChange, combo }: Omit<Props, 'open'>) {
  const { toast } = useStore()
  const [d, setD] = useState<ComboDraft>(combo ? comboToDraft(combo) : emptyCombo)
  const [submitted, setSubmitted] = useState(false)
  const errors = validateCombo(d)
  const err = (k: keyof typeof errors) => (submitted ? errors[k] : undefined)
  const set = <K extends keyof ComboDraft>(k: K, v: ComboDraft[K]) => setD((x) => ({ ...x, [k]: v }))
  const has = (id: string) => d.items.some((i) => i.id === id)
  const toggle = (id: string) => set('items', has(id) ? d.items.filter((i) => i.id !== id) : [...d.items, { id, color: 0 }])
  const sum = partsTotal(d.items)
  const price = Number(d.price)
  const saving = sum - price

  const submit = () => {
    setSubmitted(true)
    if (Object.keys(errors).length) return
    saveCombo({ id: combo?.id ?? uid('c'), name: d.name.trim(), tag: d.tag.trim(), image: d.image.trim(), price, items: d.items })
    toast(combo ? 'Combo updated' : 'Combo created')
    onOpenChange(false)
  }

  return (
    <Modal open onOpenChange={onOpenChange} size="lg" title={combo ? 'Edit combo' : 'New combo'} footer={<><Btn onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" onClick={submit}>Save</Btn></>}>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={err('name')}><Input value={d.name} onChange={(e) => set('name', e.target.value)} /></Field>
          <Field label="Tag line" hint="e.g. Oxford + Chino"><Input value={d.tag} onChange={(e) => set('tag', e.target.value)} /></Field>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Image</p>
          <ImageField value={d.image} onChange={(v) => set('image', v)} />
          {err('image') && <p className="mt-1 text-xs text-red-600">{err('image')}</p>}
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-foreground/80">Products ({d.items.length} selected)</p>
          <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-md border border-border">
            {products.filter((p) => p.status === 'active' || has(p.id)).map((p) => {
              const item = d.items.find((i) => i.id === p.id)
              return (
                <li key={p.id} className="flex items-center gap-3 px-3 py-1.5 text-[13px]">
                  <input type="checkbox" checked={!!item} onChange={() => toggle(p.id)} aria-label={p.name} />
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  {item && (
                    <Select className="w-32" value={item.color} onChange={(e) => set('items', d.items.map((i) => (i.id === p.id ? { ...i, color: Number(e.target.value) } : i)))}>
                      {p.colors.map((c, idx) => <option key={idx} value={idx}>{c.name}</option>)}
                    </Select>
                  )}
                  <span className="w-16 text-right tabular-nums text-muted-foreground">{bdt(p.offer ?? p.price)}</span>
                </li>
              )
            })}
          </ul>
          {err('items') && <p className="mt-1 text-xs text-red-600">{err('items')}</p>}
        </div>
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <Field label="Combo price (৳)" error={err('price')}><Input type="number" min={0} value={d.price} onChange={(e) => set('price', e.target.value)} /></Field>
          <div className="rounded-md bg-muted p-2.5 text-xs">
            <p>Sum of parts: <span className="font-medium tabular-nums">{bdt(sum)}</span></p>
            <p className={saving > 0 ? 'text-emerald-600' : 'text-amber-600'}>{d.price ? (saving > 0 ? `Customer saves ${bdt(saving)} (${Math.round((saving / sum) * 100)}%)` : 'Combo is not cheaper than buying separately') : 'Enter a price to see savings'}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
