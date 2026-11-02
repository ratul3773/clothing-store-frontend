import type { Product } from '@/data/catalog'

/** Public API products are resolved at runtime from the query-string route. */
export const productHref = (p: Pick<Product, 'slug' | 'custom'>) =>
  `/p/${encodeURIComponent(p.slug)}`

export const comboProductSlug = (id: string) => `combo--${id}`
export const comboHref = (id: string) => `/p/${comboProductSlug(id)}`
