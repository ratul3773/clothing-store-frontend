import type { Product } from '@/data/catalog'

/** Seeded products have a prerendered page; runtime-created (CMS) ones are resolved from the query string. */
export const productHref = (p: Pick<Product, 'slug' | 'custom'>) =>
  p.custom ? `/product/?slug=${encodeURIComponent(p.slug)}` : `/p/${p.slug}/`
