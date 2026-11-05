import type { Product } from '@/data/catalog'

/** Public API products are resolved at runtime from the query-string route. */
export const productHref = (p: Pick<Product, 'slug' | 'custom'>) =>
  `/p/${encodeURIComponent(p.slug)}`

export const comboHref = (slug: string) => `/p/${slug}`
