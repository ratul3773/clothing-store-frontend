import { totalStock, type Product } from '@/data/catalog'

export const stockKey = (color: string, size: string) => `${color}|${size}`

export type StockState = 'ok' | 'low' | 'out'
export const stockState = (p: Product, lowStock: number): StockState => {
  const t = totalStock(p)
  return t <= 0 ? 'out' : t <= lowStock ? 'low' : 'ok'
}

/** Rebuilds a stock map so it has exactly one entry per color x size. */
export const normalizeStock = (stock: Record<string, number>, colors: { name: string }[], sizes: string[]) => {
  const out: Record<string, number> = {}
  colors.forEach((c) => sizes.forEach((s) => (out[stockKey(c.name, s)] = Math.max(0, Math.floor(stock[stockKey(c.name, s)] ?? 0)))))
  return out
}

export const toNum = (v: string) => (v.trim() === '' ? NaN : Number(v))
