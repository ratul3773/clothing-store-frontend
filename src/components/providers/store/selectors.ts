import { byId, combos, coupons, DELIVERY, priceOf, type Product } from '@/data/catalog'
import { settings } from '@/data/site'
import type { Line } from './types'

export type LineInfo = { name: string; image: string; unit: number; sub: string }

export function selectLineInfo(l: Line, now?: number): LineInfo {
  if (l.comboId) {
    const c = combos.find((x) => x.id === l.comboId)
    if (!c) return { name: 'Unavailable item', image: '', unit: 0, sub: 'No longer sold' }
    return { name: c.name, image: c.image, unit: c.price, sub: `Combo · ${c.tag}` }
  }
  const p = byId(l.productId!)
  if (!p) return { name: 'Unavailable item', image: '', unit: 0, sub: 'No longer sold' }
  const col = p.colors.find((c) => c.name === l.color) ?? p.colors[0]
  return { name: p.name, image: p.images[col.image], unit: priceOf(p, now), sub: `${l.color} · ${l.size}` }
}

export const selectSubtotal = (lines: Line[], now?: number) => lines.reduce((a, l) => a + selectLineInfo(l, now).unit * l.qty, 0)
export const selectCount = (lines: Line[]) => lines.reduce((a, l) => a + l.qty, 0)

export function selectCouponDiscount(code: string | null, sub: number) {
  const c = coupons.find((x) => x.code === code)
  if (!c || sub < c.min) return 0
  return c.type === 'pct' ? Math.min(Math.round((sub * c.value) / 100), c.max) : c.value
}

export const selectDeliveryFee = (zone: 'dhaka' | 'outside', sub: number) => (sub >= settings.delivery.freeAbove ? 0 : DELIVERY[zone])

export const stockKey = (p: Product, color: string, size: string) => `${p.id}|${color}|${size}`
export const selectStock = (overrides: Record<string, number>, p: Product, color: string, size: string) =>
  overrides[stockKey(p, color, size)] ?? p.stock[`${color}|${size}`] ?? 0
