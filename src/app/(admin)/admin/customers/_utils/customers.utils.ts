import type { Order } from '@/data/orders'
import type { CustomerMeta } from '@/data/cms'
import { VIP_ORDERS, VIP_SPEND } from '@/app/(admin)/admin/customers/_constants/customers.constants'
import type { Customer, Segment } from '@/app/(admin)/admin/customers/_types/customer.types'

export const phoneKey = (p: string) => p.replace(/\s+/g, '')

export function segmentOf(orderCount: number, spend: number, allGuest: boolean): Segment {
  if (orderCount >= VIP_ORDERS || spend >= VIP_SPEND) return 'VIP'
  if (allGuest) return 'Guest-only'
  if (orderCount >= 2) return 'Repeat'
  return 'New'
}

export function buildCustomers(orders: Order[], meta: Record<string, CustomerMeta>): Customer[] {
  const groups = new Map<string, Order[]>()
  for (const o of orders) {
    const k = phoneKey(o.customer.phone)
    groups.set(k, [...(groups.get(k) ?? []), o])
  }
  return Array.from(groups, ([key, list]) => {
    const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const valid = list.filter((o) => o.status !== 'CANCELLED')
    const spend = valid.reduce((s, o) => s + o.total, 0)
    const m = meta[key] ?? {}
    const latest = sorted[0]
    return {
      key,
      name: latest.customer.name,
      phone: latest.customer.phone,
      email: sorted.find((o) => o.customer.email)?.customer.email ?? '',
      addresses: Array.from(new Set(sorted.map((o) => o.customer.address))),
      orders: sorted,
      orderCount: list.length,
      spend,
      aov: valid.length ? Math.round(spend / valid.length) : 0,
      lastOrder: latest.createdAt,
      firstOrder: sorted[sorted.length - 1].createdAt,
      segment: segmentOf(list.length, spend, list.every((o) => o.guest)),
      blocked: !!m.blocked,
      tags: m.tags ?? [],
      note: m.note ?? '',
    }
  })
}

export function customersCsv(rows: Customer[]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const head = ['Name', 'Phone', 'Email', 'Segment', 'Orders', 'Lifetime spend', 'AOV', 'First order', 'Last order', 'Blocked', 'Tags']
  const lines = rows.map((c) => [c.name, c.phone, c.email, c.segment, c.orderCount, c.spend, c.aov, c.firstOrder.slice(0, 10), c.lastOrder.slice(0, 10), c.blocked ? 'Yes' : 'No', c.tags.join('; ')].map(esc).join(','))
  return [head.map(esc).join(','), ...lines].join('\n')
}

export function downloadCsv(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
