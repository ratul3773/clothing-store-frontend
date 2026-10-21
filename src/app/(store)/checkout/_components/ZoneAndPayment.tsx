'use client'

import { Choice } from '@/components/ui/controls'
import { DELIVERY } from '@/data/catalog'
import { bdt } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import type { Payment, Zone } from '@/app/(store)/checkout/_types/checkout.types'

interface Props {
  zone: Zone
  setZone: (z: Zone) => void
  pay: Payment
  setPay: (p: Payment) => void
  methods: Payment[]
}

const PAYMENT_OPTIONS: Record<Payment, { value: Payment; title: string; hint: string }> = {
  COD: { value: 'COD', title: 'Cash on delivery', hint: 'Pay the rider when you receive it' },
  SSLCOMMERZ: { value: 'SSLCOMMERZ', title: 'SSLCommerz', hint: 'Card, bKash, Nagad, Rocket' },
}

export default function ZoneAndPayment({ zone, setZone, pay, setPay, methods }: Props) {
  useCms()
  return (
    <div className="mt-5 space-y-5">
      <p className="label-mono pt-4 text-accent">02 — Delivery zone</p>
      <Choice value={zone} onChange={(v) => setZone(v as Zone)} className="sm:grid-cols-2" options={[{ value: 'dhaka', title: 'Inside Dhaka', hint: `${bdt(DELIVERY.dhaka)} · 1–2 days` }, { value: 'outside', title: 'Outside Dhaka', hint: `${bdt(DELIVERY.outside)} · 2–4 days` }]} />
      <p className="label-mono pt-4 text-accent">03 — Payment</p>
      <Choice value={pay} onChange={(v) => setPay(v as Payment)} className={methods.length > 1 ? 'sm:grid-cols-2' : undefined} options={methods.map((m) => PAYMENT_OPTIONS[m])} />
    </div>
  )
}
