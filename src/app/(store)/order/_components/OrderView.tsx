'use client'

import { useSearchParams } from 'next/navigation'
import { useStore } from '@/components/providers/StoreProvider'
import { LIFECYCLE } from '@/data/orders'
import OrderActions from '@/app/(store)/order/_components/OrderActions'
import OrderHeader from '@/app/(store)/order/_components/OrderHeader'
import OrderItems from '@/app/(store)/order/_components/OrderItems'
import OrderNotFound from '@/app/(store)/order/_components/OrderNotFound'
import OrderTimeline from '@/app/(store)/order/_components/OrderTimeline'

export default function OrderView() {
  const id = useSearchParams().get('id')
  const { orders } = useStore()
  const o = orders.find((x) => x.id === id)
  if (!o) return <OrderNotFound />

  const idx = LIFECYCLE.indexOf(o.status as (typeof LIFECYCLE)[number])
  const dead = idx === -1

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-10">
      <OrderHeader o={o} dead={dead} />
      {!dead && <OrderTimeline idx={idx} />}
      <div className="mt-12 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <OrderItems o={o} />
        <OrderActions o={o} dead={dead} />
      </div>
    </div>
  )
}
