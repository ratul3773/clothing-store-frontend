'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import CouponBox from '@/app/(store)/checkout/_components/CouponBox'
import { settings } from '@/data/site'
import { bdt } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import type { Payment } from '@/app/(store)/checkout/_types/checkout.types'

interface Props {
  disc: number
  fee: number
  total: number
  pay: Payment
  valid: boolean
  onPlace: () => void
}

export default function OrderSummary({ disc, fee, total, pay, valid, onPlace }: Props) {
  useCms()
  const s = useStore()
  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      <div className="rounded-[3px] bg-foreground p-6 text-background">
        <p className="label-mono text-background/60">Order summary</p>
        <ul className="mt-4 divide-y divide-background/15">
          {s.lines.map((l) => { const i = s.lineInfo(l); return (
            <li key={l.key} className="flex gap-3 py-3">
              <img src={i.image} alt="" className="h-20 w-16 rounded-[2px] object-cover" />
              <div className="flex-1 text-sm"><p className="font-semibold">{i.name}</p><p className="label-mono text-background/60">{i.sub} × {l.qty}</p></div>
              <p className="text-sm font-semibold">{bdt(i.unit * l.qty)}</p>
            </li>
          )})}
        </ul>
        <CouponBox />
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{bdt(s.subtotal)}</dd></div>
          {disc > 0 && <div className="flex justify-between text-accent"><dt>Coupon</dt><dd>−{bdt(disc)}</dd></div>}
          <div className="flex justify-between"><dt>Delivery</dt><dd>{fee === 0 ? `Free (above ${bdt(settings.delivery.freeAbove)})` : bdt(fee)}</dd></div>
          <motion.div key={total} initial={{ scale: 1.05 }} animate={{ scale: 1 }} className="flex items-end justify-between border-t border-background/20 pt-4"><dt className="label-mono">Total</dt><dd className="font-display text-5xl">{bdt(total)}</dd></motion.div>
        </dl>
        <Button size="lg" variant="accent" className="mt-6 w-full" disabled={!valid} onClick={onPlace}>Place order · {pay === 'COD' ? 'COD' : 'Pay online'}</Button>
        <p className="mt-3 text-xs text-background/60">Every order is confirmed by our team before packing. You can cancel until then. <Link href="/shop" className="underline">Keep shopping</Link></p>
      </div>
    </aside>
  )
}
