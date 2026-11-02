import type { Product } from '@/data/catalog'

export const stockKey = (p: Product, color: string, size: string) => `${p.id}|${color}|${size}`
export const selectStock = (overrides: Record<string, number>, p: Product, color: string, size: string) =>
  overrides[stockKey(p, color, size)] ?? p.stock[`${color}|${size}`] ?? 0
