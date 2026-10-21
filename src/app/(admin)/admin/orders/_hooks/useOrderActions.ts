'use client'

import { useStore } from '@/components/providers/StoreProvider'
import { statusLabel, type Order, type Status } from '@/data/orders'
import { applyStatus } from '@/app/(admin)/admin/orders/_services/orders.api'

export default function useOrderActions() {
  const { patchOrder, toast } = useStore()
  return {
    setStatus(order: Order, status: Status) {
      applyStatus(order, status, patchOrder)
      toast(`${order.id} marked ${statusLabel(status).toLowerCase()}`)
    },
    bulkStatus(list: Order[], status: Status) {
      list.forEach((o) => applyStatus(o, status, patchOrder))
      toast(`${list.length} orders marked ${statusLabel(status).toLowerCase()}`)
    },
  }
}
