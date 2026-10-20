'use client'

import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputCls } from '@/components/common/FormField'
import { cn } from '@/lib/utils'
import type useContactForm from '@/app/(store)/contact/_hooks/useContactForm'

type Form = ReturnType<typeof useContactForm>

const Err = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="mt-1.5 text-xs text-accent">{msg}</p> : null)

export default function ContactForm({ c }: { c: Form }) {
  const { f, set, errors } = c
  const cls = (k: keyof typeof errors) => cn(inputCls, errors[k] && 'border-accent')
  return (
    <form onSubmit={c.submit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Field label="Full name *"><input className={cls('name')} value={f.name} onChange={set('name')} autoComplete="name" /></Field><Err msg={errors.name} /></div>
        <div><Field label="Mobile *"><input className={cls('phone')} inputMode="tel" value={f.phone} onChange={set('phone')} placeholder="01XXX XXXXXX" autoComplete="tel" /></Field><Err msg={errors.phone} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Field label="Email (optional)"><input className={cls('email')} type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field><Err msg={errors.email} /></div>
        <div><Field label="Subject *"><input className={cls('subject')} value={f.subject} onChange={set('subject')} /></Field><Err msg={errors.subject} /></div>
      </div>
      <div>
        <Field label="Message *"><textarea className={cn(cls('message'), 'h-40 resize-none py-3')} value={f.message} onChange={set('message')} placeholder="Sizing, orders, bulk requests… tell us how we can help." /></Field>
        <Err msg={errors.message} />
      </div>
      <Button type="submit" size="lg" variant="accent"><Send size={16} /> Send message</Button>
    </form>
  )
}
