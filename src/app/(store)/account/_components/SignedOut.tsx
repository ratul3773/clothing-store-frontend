'use client'

import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'

export default function SignedOut() {
  const { setAuthOpen } = useStore()
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="font-display text-[clamp(3rem,8vw,6rem)]">Your account</h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">Orders placed as a guest are linked after your phone number is verified.</p>
      <Button size="lg" className="mt-8" onClick={() => setAuthOpen(true)}>Sign in or create account</Button>
    </div>
  )
}
