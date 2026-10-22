'use client'

import { useSearchParams } from '@/lib/nav'
import OrdersList from '@/app/(admin)/admin/orders/_components/OrdersList'
import OrderDetail from '@/app/(admin)/admin/orders/_components/OrderDetail'

export default function OrdersRouter() {
  const [sp] = useSearchParams()
  const id = sp.get('id')
  return id ? <OrderDetail id={id} /> : <OrdersList />
}
