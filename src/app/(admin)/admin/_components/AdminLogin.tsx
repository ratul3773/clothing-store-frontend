'use client'

import { useState } from 'react'
import { Store } from 'lucide-react'
import { settings } from '@/data/site'
import { Btn, Card, Field, Input } from '@/components/cms/ui'

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  return (
    <div className="cms grid min-h-dvh place-items-center p-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Store className="size-4" /></span>
          <div>
            <p className="text-sm font-semibold">{settings.store.name} Admin</p>
            <p className="text-xs text-muted-foreground">Sign in to continue</p>
          </div>
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (email.trim().toLowerCase() === settings.admin.email && pw === settings.admin.password) onSuccess()
            else setErr('Invalid email or password.')
          }}
        >
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus /></Field>
          <Field label="Password" error={err}><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
          <Btn type="submit" variant="primary" className="h-9 w-full">Sign in</Btn>
        </form>
        <p className="mt-4 rounded bg-muted p-2 text-xs text-muted-foreground">Demo: {settings.admin.email} / {settings.admin.password}</p>
      </Card>
    </div>
  )
}
