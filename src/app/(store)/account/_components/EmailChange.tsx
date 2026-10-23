'use client'

import { AnimatePresence, motion } from 'motion/react'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, inputCls } from '@/components/common/FormField'
import useEmailChange from '@/app/(store)/account/_hooks/useEmailChange'
import { cn } from '@/lib/utils'

export default function EmailChange({ email }: { email: string }) {
  const e = useEmailChange()
  return (
    <section className="space-y-5">
      <h2 className="font-display sm:text-lg">Email address</h2>
      <div className="flex items-center gap-3 rounded-[3px] border border-border bg-card/70 p-4">
        <MailCheck className="text-moss" size={20} />
        <div className="min-w-0 flex-1"><p className="label-mono text-muted-foreground">Current · verified</p><p className="truncate font-semibold">{email}</p></div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {!e.pending ? (
          <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
            <Field label="New email"><input className={inputCls} type="email" value={e.newEmail} onChange={(ev) => e.setNewEmail(ev.target.value)} placeholder="you@example.com" /></Field>
            <Button variant="outline" disabled={!e.newEmail} onClick={e.sendCode}>Send verification code</Button>
          </motion.div>
        ) : (
          <motion.div key="verify" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 rounded-[3px] border border-accent bg-accent/10 p-4">
            <p className="text-sm">We sent a 6-digit code to <b>{e.pending.email}</b>. Your email stays <b>{e.user.email}</b> until it is verified.</p>
            <Field label="Verification code"><input className={cn(inputCls, 'tracking-[0.4em]')} inputMode="numeric" maxLength={6} value={e.code} onChange={(ev) => e.setCode(ev.target.value)} placeholder="······" /></Field>
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" disabled={e.code.length !== 6} onClick={e.verify}>Verify & change email</Button>
              <Button variant="ghost" onClick={e.sendCode}>Resend</Button>
              <Button variant="ghost" onClick={e.cancel}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {e.err && <p role="alert" className="text-sm text-accent">{e.err}</p>}
    </section>
  )
}
