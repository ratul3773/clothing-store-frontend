'use client'

import { useState } from 'react'
import * as T from '@radix-ui/react-tabs'
import { Sheet } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { TabsList } from '@/components/ui/tabs'
import { Field, inputCls } from '@/components/common/FormField'
import { useStore } from '@/components/providers/StoreProvider'

export default function AuthSheet() {
  const { authOpen, setAuthOpen, setUser, toast } = useStore()
  const [tab, setTab] = useState('in')
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', otp: '' })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const finish = (name: string, phone: string) => {
    setUser({ name, email: f.email || 'tanvir@example.com', phone, verified: true, password: f.password || undefined })
    setAuthOpen(false)
    setStep('form')
    toast(`Welcome, ${name.split(' ')[0]}`)
  }

  return (
    <Sheet open={authOpen} onOpenChange={setAuthOpen} title="Member access" description="Sign in to see orders, wishlist and saved addresses." side="center">
      <T.Root value={tab} onValueChange={(v) => { setTab(v); setStep('form') }} className="p-5">
        <TabsList value={tab} layoutId="auth-tab" items={[{ value: 'in', label: 'Sign in' }, { value: 'up', label: 'Create account' }]} />
        <T.Content value="in" className="mt-5 space-y-4 outline-none">
          <Field label="Email"><input className={inputCls} type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" /></Field>
          <Field label="Password"><input className={inputCls} type="password" value={f.password} onChange={set('password')} placeholder="••••••••" /></Field>
          <Button className="w-full" size="lg" onClick={() => finish('Tanvir Ahmed', '01712 345678')}>Sign in</Button>
        </T.Content>
        <T.Content value="up" className="mt-5 space-y-4 outline-none">
          {step === 'form' ? (
            <>
              <Field label="Full name"><input className={inputCls} value={f.name} onChange={set('name')} placeholder="Tanvir Ahmed" /></Field>
              <Field label="Email"><input className={inputCls} type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" /></Field>
              <Field label="Mobile (required, verified by OTP)"><input className={inputCls} inputMode="tel" value={f.phone} onChange={set('phone')} placeholder="01XXX XXXXXX" /></Field>
              <Field label="Password"><input className={inputCls} type="password" value={f.password} onChange={set('password')} placeholder="At least 8 characters" /></Field>
              <Button className="w-full" size="lg" disabled={!f.name || !f.phone || f.password.length < 8} onClick={() => setStep('otp')}>Send OTP</Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">We sent a 4-digit code to {f.phone}. Demo code: <b className="text-foreground">1234</b></p>
              <Field label="OTP code"><input className={inputCls + ' text-center text-2xl tracking-[0.6em]'} maxLength={4} value={f.otp} onChange={set('otp')} /></Field>
              <Button className="w-full" size="lg" variant="accent" disabled={f.otp !== '1234'} onClick={() => finish(f.name, f.phone)}>Verify &amp; continue</Button>
            </>
          )}
        </T.Content>
        <div className="my-5 flex items-center gap-3 text-muted-foreground"><span className="h-px flex-1 bg-border" /><span className="label-mono">or</span><span className="h-px flex-1 bg-border" /></div>
        <Button variant="outline" className="w-full" size="lg" onClick={() => finish('Tanvir Ahmed', '01712 345678')}>Continue with Google</Button>
      </T.Root>
    </Sheet>
  )
}
