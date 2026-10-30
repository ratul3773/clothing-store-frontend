import { combos, hero, heroAlt, taxonomy } from '@/data/catalog'
import { findVisible, liveProducts, visibleProducts } from '@/lib/storefront'
import { useGetCategoriesQuery } from '@/redux/apis/category.api'

export function getHeroImages() {
  return { hero, heroAlt }
}

export function getCategoryTiles() {
  const {data: categories = [], isLoading, isError} = useGetCategoriesQuery()
  return {
    tiles: categories.map((t) => ({ title: t.name, note: t.children?.map((c) => c.name).join(' · ') || t.description, cat: t.name, image: t.imageUrl })), isLoading, isError}
}

export function getBestSellers(count = 4) {
  return [...liveProducts()].sort((a, b) => b.sold - a.sold).slice(0, count)
}

/** Combos whose pieces are all still on sale. */
export function getCombos() {
  return combos.filter((c) => c.items.length > 0 && c.items.every((it) => findVisible(it.id)))
}

export { visibleProducts }
