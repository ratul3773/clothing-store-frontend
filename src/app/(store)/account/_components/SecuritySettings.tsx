'use client'

import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputCls } from '@/components/common/FormField'
import PasswordStrength from '@/app/(store)/account/_components/PasswordStrength'
import usePasswordChange from '@/app/(store)/account/_hooks/usePasswordChange'

export default function SecuritySettings() {
  const p = usePasswordChange()
  const type = p.show ? 'text' : 'password'
  return (
    <form onSubmit={p.submit} className="max-w-xl space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display flex items-center gap-3 sm:text-lg"><ShieldCheck className="text-accent" /> Change password</h2>
        <button type="button" onClick={p.toggleShow} className="label-mono flex items-center gap-1.5 text-muted-foreground hover:text-foreground">{p.show ? <EyeOff size={14} /> : <Eye size={14} />}{p.show ? 'Hide' : 'Show'}</button>
      </div>
      <Field label="Current password"><input className={inputCls} type={type} autoComplete="current-password" value={p.f.cur} onChange={p.set('cur')} /></Field>
      <Field label="New password"><input className={inputCls} type={type} autoComplete="new-password" value={p.f.next} onChange={p.set('next')} /></Field>
      <PasswordStrength score={p.score} rules={p.rules} />
      <Field label="Confirm new password"><input className={inputCls} type={type} autoComplete="new-password" value={p.f.again} onChange={p.set('again')} /></Field>
      {p.err && <p role="alert" className="text-sm text-accent">{p.err}</p>}
      <Button type="submit" variant="accent" size="lg" disabled={!p.f.next || !p.f.again}>Update password</Button>
    </form>
  )
}
