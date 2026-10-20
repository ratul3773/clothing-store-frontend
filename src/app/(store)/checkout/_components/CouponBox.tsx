'use client'

import { useState } from 'react'
import { Tag, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'

export default function CouponBox() {
  const s = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  return (
    <>
      <div className="mt-4 flex gap-2">
        {s.coupon ? (
          <div className="label-mono flex flex-1 items-center justify-between rounded-[3px] bg-accent px-4 py-3 text-accent-foreground"><span className="flex items-center gap-2"><Tag size={14} /> {s.coupon}</span><button aria-label="Remove coupon" onClick={s.removeCoupon}><X size={14} /></button></div>
        ) : (
          <>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon (try WELCOME10)" className="h-11 flex-1 rounded-[3px] border border-background/30 bg-transparent px-3 text-sm outline-none placeholder:text-background/40 focus:border-accent" />
            <Button variant="light" size="md" onClick={() => setErr(s.applyCoupon(code, s.subtotal))}>Apply</Button>
          </>
        )}
      </div>
      {err && <p className="mt-2 text-xs text-accent">{err}</p>}
    </>
  )
}
