'use client'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { Field, inputCls } from '@/components/common/FormField'
import type { Address } from '@/components/providers/StoreProvider'
import { cn } from '@/lib/utils'

interface Props {
  form: Address | null
  setForm: (a: Address | null) => void
  valid: boolean
  onSave: () => void
}

export default function AddressFormSheet({ form, setForm, valid, onSave }: Props) {
  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form!, [k]: e.target.value })
  return (
    <Sheet open={!!form} onOpenChange={(b) => !b && setForm(null)} title={form?.id ? 'Edit address' : 'Add address'} description="Used for delivery at checkout." side="center">
      {form && (
        <div className="space-y-4 p-5">
          <Field label="Label"><input className={inputCls} value={form.label} onChange={set('label')} placeholder="Home, Office…" /></Field>
          <Field label="Recipient name"><input className={inputCls} value={form.name} onChange={set('name')} /></Field>
          <Field label="Mobile number"><input className={inputCls} inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="01XXX XXXXXX" /></Field>
          <Field label="Address"><textarea className={cn(inputCls, 'h-24 resize-none py-3')} value={form.line} onChange={set('line')} placeholder="House, road, area" /></Field>
          <Field label="City / district"><input className={inputCls} value={form.city} onChange={set('city')} /></Field>
          <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" className="h-4 w-4 accent-[#e4442b]" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default address</label>
          <Button className="w-full" size="lg" variant="accent" disabled={!valid} onClick={onSave}>{form.id ? 'Save changes' : 'Add address'}</Button>
        </div>
      )}
    </Sheet>
  )
}
