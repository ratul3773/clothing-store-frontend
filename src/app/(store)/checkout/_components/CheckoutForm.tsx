'use client'

import { Field, inputCls } from '@/components/common/FormField'
import { useStore } from '@/components/providers/StoreProvider'
import type { CheckoutFields } from '@/app/(store)/checkout/_types/checkout.types'

interface Props {
  f: CheckoutFields
  set: (k: keyof CheckoutFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export default function CheckoutForm({ f, set }: Props) {
  const s = useStore()
  return (
    <>
      <h1 className="font-display text-lg sm:text-2xl font-medium">Checkout</h1>
      {!s.user && (
        <p className="mt-4 rounded-[3px] border border-border bg-card/70 p-4 text-sm">
          No account needed. Already a member? <button onClick={() => s.setAuthOpen(true)} className="font-semibold text-accent underline underline-offset-4">Sign in</button> to use saved addresses.
        </p>
      )}
      <div className="mt-8 space-y-5">
        <p className="label-mono text-accent">01 — Contact &amp; address</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *"><input className={inputCls} value={f.name} onChange={set('name')} autoComplete="name" /></Field>
          <Field label="Mobile *"><input className={inputCls} inputMode="tel" value={f.phone} onChange={set('phone')} placeholder="01XXX XXXXXX" autoComplete="tel" /></Field>
        </div>
        <Field label="Delivery address *"><textarea className={inputCls + ' h-24 resize-none py-3'} value={f.address} onChange={set('address')} placeholder="House, road, area, district" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email (optional)"><input className={inputCls} type="email" value={f.email} onChange={set('email')} /></Field>
          <Field label="Order note (optional)"><input className={inputCls} value={f.note} onChange={set('note')} /></Field>
        </div>
      </div>
    </>
  )
}
