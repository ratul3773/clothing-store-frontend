'use client'

import { useState } from 'react'
import { useNavigate } from '@/lib/nav'
import { useStore } from '@/components/providers/StoreProvider'
import { useCms } from '@/lib/useCms'
import { enabledPayments } from '@/app/(store)/checkout/_utils/checkout.utils'
import { isCheckoutValid } from '@/app/(store)/checkout/_schemas/checkout.schema'
import type { CheckoutFields, Payment, Zone } from '@/app/(store)/checkout/_types/checkout.types'

export default function useCheckout() {
  useCms()
  const s = useStore()
  const nav = useNavigate()
  const [f, setF] = useState<CheckoutFields>({ name: s.user?.name ?? '', phone: s.user?.phone ?? '', address: '', email: s.user?.email ?? '', note: '' })
  const [zone, setZone] = useState<Zone>('dhaka')
  const [chosenPay, setPay] = useState<Payment>('COD')
  const methods = enabledPayments()
  // If the owner disables the selected method while the shopper is on this page, fall back to the first enabled one.
  const pay = methods.includes(chosenPay) ? chosenPay : methods[0]

  const set = (k: keyof CheckoutFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value })

  const disc = s.couponDiscount(s.subtotal)
  const fee = s.deliveryFee(zone, s.subtotal)
  const total = s.subtotal - disc + fee
  const valid = isCheckoutValid(f)

  const place = () => {
    const items = s.lines.map((l) => {
      const i = s.lineInfo(l)
      return { productId: l.productId ?? l.comboId!, name: i.name, color: l.color, size: l.comboId ? '' : l.size, qty: l.qty, price: i.unit, image: i.image }
    })
    const o = s.placeOrder({
      source: 'WEBSITE', guest: !s.user, customer: { name: f.name, phone: f.phone, address: f.address, zone, email: f.email, note: f.note },
      items, subtotal: s.subtotal, delivery: fee, discount: disc, total, payment: pay,
    })
    s.clear(); s.removeCoupon(); nav(`/order?id=${o.id}`)
  }

  return { f, set, zone, setZone, pay, setPay, methods, disc, fee, total, valid, place }
}
