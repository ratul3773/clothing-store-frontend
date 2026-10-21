import type { Order } from '@/data/orders'
import { byId } from '@/data/catalog'
import { RANGES } from '@/app/(admin)/admin/reports/_constants/reports.constants'
import type { RangeKey, Row, Summary } from '@/app/(admin)/admin/reports/_types/reports.types'

export const isSale = (o: Order) => o.status !== 'CANCELLED' && o.status !== 'RETURNED'

export function filterByRange(orders: Order[], range: RangeKey): Order[] {
  const days = RANGES.find((r) => r.key === range)?.days
  if (!days) return orders
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const from = +d - (days - 1) * 864e5
  return orders.filter((o) => +new Date(o.createdAt) >= from)
}

export function summarize(orders: Order[]): Summary {
  const sales = orders.filter(isSale)
  const gross = sales.reduce((a, o) => a + o.subtotal, 0)
  const net = sales.reduce((a, o) => a + o.total, 0)
  return {
    orders: sales.length,
    gross,
    delivery: sales.reduce((a, o) => a + o.delivery, 0),
    discount: sales.reduce((a, o) => a + o.discount, 0),
    net,
    aov: sales.length ? Math.round(net / sales.length) : 0,
    units: sales.reduce((a, o) => a + o.items.reduce((s, i) => s + i.qty, 0), 0),
    cancelled: orders.length - sales.length,
    paid: sales.filter((o) => o.paid).reduce((a, o) => a + o.total, 0),
  }
}

/** Group sales by an order-level key. */
export function groupOrders(orders: Order[], keyOf: (o: Order) => string): Row[] {
  const m = new Map<string, Row>()
  orders.filter(isSale).forEach((o) => {
    const k = keyOf(o)
    const r = m.get(k) ?? { label: k, orders: 0, units: 0, revenue: 0 }
    r.orders++
    r.units += o.items.reduce((a, i) => a + i.qty, 0)
    r.revenue += o.total
    m.set(k, r)
  })
  return Array.from(m.values()).sort((a, b) => b.revenue - a.revenue)
}

/** Group item-level revenue by a product-derived key (category, subcategory, product). */
export function groupItems(orders: Order[], keyOf: (productId: string, name: string) => string): Row[] {
  const m = new Map<string, Row & { ids: Set<string> }>()
  orders.filter(isSale).forEach((o) =>
    o.items.forEach((i) => {
      const k = keyOf(i.productId, i.name)
      const r = m.get(k) ?? { label: k, orders: 0, units: 0, revenue: 0, ids: new Set<string>() }
      r.units += i.qty
      r.revenue += i.qty * i.price
      r.ids.add(o.id)
      r.orders = r.ids.size
      m.set(k, r)
    }),
  )
  return Array.from(m.values()).map(({ ids: _ids, ...r }) => r).sort((a, b) => b.revenue - a.revenue)
}

export const categoryOf = (id: string) => byId(id)?.category ?? 'Unknown'
export const subOf = (id: string) => {
  const p = byId(id)
  return p ? `${p.category} / ${p.sub}` : 'Unknown'
}

const esc = (v: string | number | boolean | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`

export function ordersToCsv(orders: Order[]): string {
  const head = ['Order ID', 'Date', 'Status', 'Source', 'Customer', 'Phone', 'Zone', 'Address', 'Items', 'Subtotal', 'Delivery', 'Discount', 'Total', 'Payment', 'Paid', 'Courier', 'Consignment']
  const lines = orders.map((o) =>
    [o.id, o.createdAt, o.status, o.source, o.customer.name, o.customer.phone, o.customer.zone, o.customer.address, o.items.map((i) => `${i.name} (${i.color}/${i.size}) x${i.qty}`).join('; '), o.subtotal, o.delivery, o.discount, o.total, o.payment, !!o.paid, o.courier, o.consignment].map(esc).join(','),
  )
  return [head.map(esc).join(','), ...lines].join('\n')
}

export function downloadCsv(name: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
