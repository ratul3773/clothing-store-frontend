import { bySlug, products } from '@/data/catalog'
import { findVisible } from '@/lib/storefront'

export function getProducts() {
  return products
}

export function getProductBySlug(slug?: string) {
  return bySlug(slug)
}

/** Visible (active) product by id, or undefined when deleted or drafted. */
export function getProductById(id: string) {
  return findVisible(id)
}
