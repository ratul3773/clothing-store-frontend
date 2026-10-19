import { combos, hero, heroAlt, taxonomy } from '@/data/catalog'
import { findVisible, liveProducts, visibleProducts } from '@/lib/storefront'

export function getHeroImages() {
  return { hero, heroAlt }
}

export function getCategoryTiles() {
  return taxonomy.map((t) => ({ title: t.label, note: t.subs.join(' · ') || t.blurb, cat: t.cat, image: t.image }))
}

export function getBestSellers(count = 4) {
  return [...liveProducts()].sort((a, b) => b.sold - a.sold).slice(0, count)
}

/** Combos whose pieces are all still on sale. */
export function getCombos() {
  return combos.filter((c) => c.items.length > 0 && c.items.every((it) => findVisible(it.id)))
}

export { visibleProducts }
