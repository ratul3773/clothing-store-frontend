import { Suspense } from 'react'
import OrderView from '@/app/(store)/order/_components/OrderView'
import OrderSkeleton from '@/app/(store)/order/_components/OrderSkeleton'

export default function Page() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderView />
    </Suspense>
  )
}
