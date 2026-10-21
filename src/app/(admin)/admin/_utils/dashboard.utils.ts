import type { Order } from '@/data/orders'
import type { Product } from '@/data/catalog'
import type { DashboardStats, LowStockRow } from '@/app/(admin)/admin/_types/dashboard.types'

const DAY = 864e5
export const counted = (o: Order) => o.status !== 'CANCELLED' && o.status !== 'RETURNED'
export const dayKey = (d: Date | string) => {
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
const startOfToday = (now: number) => {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return +d
}
export const phoneKey = (p: string) => p.replace(/\D/g, '')

export function computeStats(orders: Order[], now: number, chartDays = 14): DashboardStats {
  const t0 = startOfToday(now)
  const sum = (from: number) => orders.filter((o) => counted(o) && +new Date(o.createdAt) >= from).reduce((a, o) => a + o.total, 0)
  const valid = orders.filter(counted)
  const days = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date(t0 - (chartDays - 1 - i) * DAY)
    return { key: dayKey(d), label: `${d.getDate()}/${d.getMonth() + 1}`, revenue: 0, orders: 0 }
  })
  valid.forEach((o) => {
    const p = days.find((d) => d.key === dayKey(o.createdAt))
    if (p) {
      p.revenue += o.total
      p.orders++
    }
  })
  const counts = new Map<string, number>()
  orders.forEach((o) => counts.set(o.status, (counts.get(o.status) ?? 0) + 1))
  const first = new Map<string, number>()
  orders.forEach((o) => {
    const k = phoneKey(o.customer.phone)
    const t = +new Date(o.createdAt)
    if (!first.has(k) || t < first.get(k)!) first.set(k, t)
  })
  const prod = new Map<string, { id: string; name: string; image: string; qty: number; revenue: number }>()
  valid.forEach((o) =>
    o.items.forEach((it) => {
      const r = prod.get(it.productId) ?? { id: it.productId, name: it.name, image: it.image, qty: 0, revenue: 0 }
      r.qty += it.qty
      r.revenue += it.qty * it.price
      prod.set(it.productId, r)
    }),
  )
  return {
    today: sum(t0),
    week: sum(t0 - 6 * DAY),
    month: sum(t0 - 29 * DAY),
    orderCount: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length,
    aov: valid.length ? Math.round(valid.reduce((a, o) => a + o.total, 0) / valid.length) : 0,
    newCustomers: Array.from(first.values()).filter((t) => t >= t0 - 29 * DAY).length,
    days,
    byStatus: Array.from(counts, ([status, count]) => ({ status, count })).sort((a, b) => b.count - a.count),
    top: Array.from(prod.values()).sort((a, b) => b.qty - a.qty).slice(0, 5),
  }
}

export function lowStockRows(products: Product[], threshold: number): LowStockRow[] {
  const rows: LowStockRow[] = []
  products.forEach((p) =>
    Object.entries(p.stock).forEach(([k, qty]) => {
      if (qty <= threshold) rows.push({ id: p.id, name: p.name, sku: p.sku, variant: k.replace('|', ' / '), qty })
    }),
  )
  return rows.sort((a, b) => a.qty - b.qty)
}

export const lowStockProductCount = (rows: LowStockRow[]) => new Set(rows.map((r) => r.id)).size
