import type { Order, Status } from '@/data/orders'
import type { OrderFilters } from '@/app/(admin)/admin/orders/_types/orders.types'

export function filterOrders(orders: Order[], f: OrderFilters): Order[] {
  const q = f.q.trim().toLowerCase()
  const qd = q.replace(/\D/g, '')
  const from = f.from ? +new Date(`${f.from}T00:00:00`) : 0
  const to = f.to ? +new Date(`${f.to}T23:59:59`) : Infinity
  return orders
    .filter((o) => {
      if (q && !(o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || (qd && o.customer.phone.replace(/\D/g, '').includes(qd)))) return false
      if (f.status && o.status !== f.status) return false
      if (f.source && o.source !== f.source) return false
      if (f.payment && o.payment !== f.payment) return false
      if (f.courier === 'none' ? !!o.courier : f.courier && o.courier !== f.courier) return false
      const t = +new Date(o.createdAt)
      return t >= from && t <= to
    })
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

/** Order currently holds (has deducted) catalog stock. */
export const holdsStock = (s: Status) => s !== 'PENDING_CONFIRMATION' && s !== 'CANCELLED' && s !== 'RETURNED'

export const fmtDate = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
