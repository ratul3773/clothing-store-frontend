import { priceOf, totalStock, type Product } from '@/data/catalog'
import type { ShopFilterState, SortKey } from '@/app/(store)/shop/_types/shop.types'

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => b.sold - a.sold,
  low: (a, b) => priceOf(a) - priceOf(b),
  high: (a, b) => priceOf(b) - priceOf(a),
  rating: (a, b) => b.rating - a.rating,
}

export function filterAndSort(all: Product[], f: ShopFilterState): Product[] {
  let l = all.filter((p) => (f.cat === 'all' || p.category === f.cat) && (!f.sub || p.sub === f.sub) && (!f.price || (priceOf(p) >= f.price[0] && priceOf(p) <= f.price[1])))
  if (f.q) l = l.filter((p) => [p.name, p.sku, p.sub, p.material, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(f.q))
  if (f.offersOnly) l = l.filter((p) => p.offer)
  if (f.inStock) l = l.filter((p) => totalStock(p) > 0)
  if (f.sizes.length) l = l.filter((p) => f.sizes.some((s) => p.sizes.includes(s)))
  return [...l].sort(comparators[f.sort as SortKey])
}

export function shopTitle(cat: string, sub: string | null) {
  const label = cat === 'all' ? '' : cat.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return sub ? `${sub} ${label}`.trim() : cat === 'all' ? 'The shop' : label
}
