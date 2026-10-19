import { priceOf } from '@/data/catalog'
import { findProduct } from '@/lib/storefront'
import type { getCombos } from '@/app/(store)/_services/home.api'

type Combo = ReturnType<typeof getCombos>[number]

export function comboSum(c: Combo, now?: number) {
  return c.items.reduce((a, it) => {
    const p = findProduct(it.id)
    return a + (p ? priceOf(p, now) : 0)
  }, 0)
}
