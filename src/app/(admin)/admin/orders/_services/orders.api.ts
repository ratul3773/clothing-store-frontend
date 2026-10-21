import { products } from '@/data/catalog'
import { setProductStock } from '@/data/cms'
import type { Order, Status } from '@/data/orders'
import { holdsStock } from '@/app/(admin)/admin/orders/_utils/orders.utils'

/** Add (+) or remove (-) units from catalog stock for each line of an order. */
export function adjustStock(order: Pick<Order, 'items'>, sign: 1 | -1) {
  order.items.forEach((it) => {
    const p = products.find((x) => x.id === it.productId)
    if (!p) return
    const k = `${it.color}|${it.size}`
    setProductStock(p.id, { ...p.stock, [k]: Math.max(0, (p.stock[k] ?? 0) + sign * it.qty) })
  })
}

/** Change status, record history and keep catalog stock in sync (decrement on confirm, restore on cancel/return). */
export function applyStatus(order: Order, status: Status, patchOrder: (id: string, patch: Partial<Order>) => void) {
  if (order.status === status) return
  const was = holdsStock(order.status)
  const now = holdsStock(status)
  if (!was && now) adjustStock(order, -1)
  if (was && !now) adjustStock(order, 1)
  const at = new Date().toISOString()
  patchOrder(order.id, {
    status,
    history: [...(order.history ?? []), { status, at }],
    ...(status === 'DELIVERED' ? { deliveredAt: at, paid: order.payment === 'COD' ? true : order.paid } : {}),
  })
}
