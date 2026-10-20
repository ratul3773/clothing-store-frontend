'use client'

import { useStore } from '@/components/providers/StoreProvider'
import CheckoutForm from '@/app/(store)/checkout/_components/CheckoutForm'
import EmptyBag from '@/app/(store)/checkout/_components/EmptyBag'
import OrderSummary from '@/app/(store)/checkout/_components/OrderSummary'
import ZoneAndPayment from '@/app/(store)/checkout/_components/ZoneAndPayment'
import { useCms } from '@/lib/useCms'
import useCheckout from '@/app/(store)/checkout/_hooks/useCheckout'

export default function Page() {
  useCms()
  const s = useStore()
  const c = useCheckout()

  if (s.lines.length === 0) return <EmptyBag />

  return (
    <div className="mx-auto grid max-w-[88rem] gap-12 px-5 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-10">
      <div>
        <CheckoutForm f={c.f} set={c.set} />
        <ZoneAndPayment zone={c.zone} setZone={c.setZone} pay={c.pay} setPay={c.setPay} methods={c.methods} />
      </div>
      <OrderSummary disc={c.disc} fee={c.fee} total={c.total} pay={c.pay} valid={c.valid} onPlace={c.place} />
    </div>
  )
}
