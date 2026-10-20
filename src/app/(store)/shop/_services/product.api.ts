import { priceOf, taxonomy } from '@/data/catalog'
import { allSizes, liveProducts } from '@/lib/storefront'

/** Products customers may see (drafts excluded). */
export function getProducts() {
  return liveProducts()
}

export function getCategories() {
  return taxonomy
}

export function getSubcategories(cat: string): string[] {
  return taxonomy.find((t) => t.cat === cat)?.subs ?? []
}

export function getSizes() {
  return allSizes(liveProducts())
}

/** Rounded min/max of current selling prices, used as the price slider range. */
export function getPriceBounds(): [number, number] {
  const prices = liveProducts().map(priceOf)
  if (prices.length === 0) return [0, 1000]
  const lo = Math.floor(Math.min(...prices) / 100) * 100
  const hi = Math.ceil(Math.max(...prices) / 100) * 100
  return [lo, Math.max(hi, lo + 100)]
}
