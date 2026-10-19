'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/controls'
import { Field, inputCls } from '@/components/common/FormField'
import { useStore } from '@/components/providers/StoreProvider'
import EmailChange from '@/app/(store)/account/_components/EmailChange'
import { isProfileValid } from '@/app/(store)/account/_schemas/account.schema'

export default function ProfileSettings() {
  const { user, setUser, toast } = useStore()
  const [sms, setSms] = useState(true)
  const [name, setName] = useState(user!.name)
  const [phone, setPhone] = useState(user!.phone)

  const dirty = name !== user!.name || phone !== user!.phone
  const valid = isProfileValid(name, phone)

  const save = () => {
    setUser({ ...user!, name: name.trim(), phone: phone.trim() })
    toast('Details updated')
  }

  return (
    <div className="grid max-w-5xl gap-10 lg:grid-cols-2">
      <section className="space-y-5">
        <h2 className="font-display text-4xl">Your details</h2>
        <Field label="Full name"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Mobile number"><input className={inputCls} value={phone} inputMode="tel" onChange={(e) => setPhone(e.target.value)} /></Field>
        <div className="flex items-center justify-between rounded-[3px] border border-border p-4 text-sm"><span>SMS order updates</span><Toggle checked={sms} onChange={setSms} label="SMS updates" /></div>
        <div className="flex gap-3">
          <Button variant="accent" disabled={!dirty || !valid} onClick={save}>Save changes</Button>
          <Button variant="ghost" disabled={!dirty} onClick={() => { setName(user!.name); setPhone(user!.phone) }}>Discard</Button>
        </div>
      </section>
      <EmailChange />
    </div>
  )
}
