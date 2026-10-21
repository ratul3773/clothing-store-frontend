'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer, Trash2 } from 'lucide-react'
import { Btn, Empty, PageHeader } from '@/components/cms/ui'
import { ConfirmDialog } from '@/components/cms/Modal'
import StatusBadge from '@/components/cms/StatusBadge'
import { useStore } from '@/components/providers/StoreProvider'
import { useNavigate } from '@/lib/nav'
import { adjustStock } from '@/app/(admin)/admin/orders/_services/orders.api'
import { fmtDate, holdsStock } from '@/app/(admin)/admin/orders/_utils/orders.utils'
import OrderCustomerCard from '@/app/(admin)/admin/orders/_components/OrderCustomerCard'
import OrderItemsCard from '@/app/(admin)/admin/orders/_components/OrderItemsCard'
import OrderStatusCard from '@/app/(admin)/admin/orders/_components/OrderStatusCard'
import OrderShippingCard from '@/app/(admin)/admin/orders/_components/OrderShippingCard'
import OrderNotesCard from '@/app/(admin)/admin/orders/_components/OrderNotesCard'
import OrderExchangeCard from '@/app/(admin)/admin/orders/_components/OrderExchangeCard'
import OrderInvoice from '@/app/(admin)/admin/orders/_components/OrderInvoice'

export default function OrderDetail({ id }: { id: string }) {
  const { orders, removeOrder, toast } = useStore()
  const go = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const order = orders.find((o) => o.id === id)
  if (!order) {
    return (
      <div>
        <PageHeader title="Order not found" crumbs={['Orders']} />
        <Empty title={`No order with ID ${id}`} action={<Link href="/admin/orders"><Btn>Back to orders</Btn></Link>} />
      </div>
    )
  }
  const del = () => {
    if (holdsStock(order.status)) adjustStock(order, 1)
    removeOrder(order.id)
    toast(`Order ${order.id} deleted`)
    go('/admin/orders')
  }
  return (
    <div>
      <div className="print:hidden">
        <PageHeader
          crumbs={['Orders', order.id]}
          title={order.id}
          description={`Placed ${fmtDate(order.createdAt)}`}
          actions={
            <>
              <StatusBadge status={order.status} />
              <Link href="/admin/orders"><Btn><ArrowLeft className="size-4" /> Orders</Btn></Link>
              <Btn onClick={() => window.print()}><Printer className="size-4" /> Print invoice</Btn>
              <Btn variant="dangerOutline" onClick={() => setConfirmDelete(true)}><Trash2 className="size-4" /> Delete</Btn>
            </>
          }
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <OrderItemsCard order={order} />
            {order.exchange && <OrderExchangeCard order={order} />}
            <OrderNotesCard order={order} />
          </div>
          <div className="space-y-4">
            <OrderStatusCard order={order} />
            <OrderShippingCard order={order} />
            <OrderCustomerCard order={order} />
          </div>
        </div>
      </div>
      <OrderInvoice order={order} />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete order?"
        description={`Order ${order.id} will be permanently removed.${holdsStock(order.status) ? ' Reserved stock will be returned to inventory.' : ''}`}
        onConfirm={del}
      />
    </div>
  )
}
