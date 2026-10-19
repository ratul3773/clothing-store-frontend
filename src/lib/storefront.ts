import { activeFlash, products, taxonomy, type Product } from '@/data/catalog'
import { banners, flashSales, isFlashLive, type Banner, type FlashSale } from '@/data/site'
import type { Review } from '@/data/reviews'

/** Drafts are never shown to customers. */
export const isVisible = (p: Product) => p.status === 'active'

export const liveProducts = () => products.filter(isVisible)

/** Safe lookup: undefined for deleted or draft products. */
export const findVisible = (id: string): Product | undefined => {
  const p = products.find((x) => x.id === id)
  return p && isVisible(p) ? p : undefined
}

/** Safe lookup that tolerates products deleted from the CMS. */
export const findProduct = (id: string): Product | undefined => products.find((x) => x.id === id)

export const visibleProducts = (ids: string[]) => ids.map(findVisible).filter((p): p is Product => !!p)

export const categoryLabel = (cat: string) => taxonomy.find((t) => t.cat === cat)?.label ?? cat

export const liveBanners = (placement: Banner['placement'], now: number) =>
  banners
    .filter((b) => b.placement === placement && b.active)
    .filter((b) => (!b.startsAt || +new Date(b.startsAt) <= now) && (!b.endsAt || now < +new Date(b.endsAt)))
    .sort((a, b) => a.order - b.order)

export const liveFlash = (now: number): FlashSale | undefined => flashSales.find((f) => isFlashLive(f, now))

/** Flash discount percent applied to a product right now (0 when none). */
export const flashPct = (p: Product, now?: number) => activeFlash(p, now)?.discountPct ?? 0

/** Total discount vs the list price, including offer and flash. */
export const discountPct = (p: Product, price: number) => (p.price > 0 && price < p.price ? Math.round(((p.price - price) / p.price) * 100) : 0)

export const visibleReviews = (reviews: Review[]) => reviews.filter((r) => !r.hidden)

/** Review count shown on the storefront: seeded count adjusted for hidden and newly written reviews. */
export const reviewCount = (p: Product, reviews: Review[]) => {
  const mine = reviews.filter((r) => r.productId === p.id)
  return Math.max(0, p.reviews + mine.filter((r) => !r.seed && !r.hidden).length - mine.filter((r) => r.seed && r.hidden).length)
}

const ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
/** Union of sizes across visible products, letters first in garment order then numerics ascending. */
export const allSizes = (list: Product[]) => {
  const set = new Set(list.flatMap((p) => p.sizes))
  const rank = (s: string) => (ORDER.includes(s) ? ORDER.indexOf(s) : 100 + (parseFloat(s) || 0))
  return [...set].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}
