'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { CheckoutFields, Payment, Zone } from '@/app/(store)/checkout/_types/checkout.types'

/** Dormant form compatibility: never create demo orders or mutate a real bag. */
export default function useCheckout() {
  const [f, setF] = useState<CheckoutFields>({ name: '', phone: '', address: '', email: '', note: '' })
  const [zone, setZone] = useState<Zone>('dhaka')
  const [pay, setPay] = useState<Payment>('COD')
  const set = (key: keyof CheckoutFields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((current) => ({ ...current, [key]: event.target.value }))
  return { f, set, zone, setZone, pay, setPay, methods: ['COD'] as Payment[], disc: 0, fee: 0, total: 0, valid: false, place: () => toast.error('Checkout is not available yet.') }
}
