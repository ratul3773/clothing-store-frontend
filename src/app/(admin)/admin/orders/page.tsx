import { Suspense } from 'react'
import OrdersRouter from '@/app/(admin)/admin/orders/_components/OrdersRouter'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <OrdersRouter />
    </Suspense>
  )
}
