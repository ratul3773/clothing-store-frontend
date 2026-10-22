import { Suspense } from 'react'
import OrdersRouter from '@/app/(admin)/admin/orders/_components/OrdersRouter'

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersRouter />
    </Suspense>
  )
}
