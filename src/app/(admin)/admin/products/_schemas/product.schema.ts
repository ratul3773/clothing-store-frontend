import type { ProductDraft, ProductErrors } from '../_types/products.types'
import { toNum } from '../_utils/products.utils'

type Existing = { id: string; slug: string; sku: string }

export function validateProduct(d: ProductDraft, others: Existing[]): ProductErrors {
  const e: ProductErrors = {}
  if (!d.name.trim()) e.name = 'Name is required'
  if (!d.slug.trim()) e.slug = 'Slug is required'
  else if (others.some((o) => o.id !== d.id && o.slug === d.slug.trim())) e.slug = 'Slug is already used by another product'
  if (!d.sku.trim()) e.sku = 'SKU is required'
  else if (others.some((o) => o.id !== d.id && o.sku.toLowerCase() === d.sku.trim().toLowerCase())) e.sku = 'SKU is already used by another product'
  if (!d.category) e.category = 'Select a category'
  if (!d.sub) e.sub = 'Select a subcategory'
  const price = toNum(d.price)
  if (Number.isNaN(price) || price < 0) e.price = 'Enter a valid price (0 or more)'
  if (d.offer.trim() !== '') {
    const offer = toNum(d.offer)
    if (Number.isNaN(offer) || offer < 0) e.offer = 'Enter a valid offer price'
    else if (!Number.isNaN(price) && offer >= price) e.offer = 'Offer price must be lower than the price'
  }
  if (d.images.filter((i) => i.trim()).length < 1) e.images = 'Add at least one image'
  if (d.colors.length < 1) e.colors = 'Add at least one color'
  else if (new Set(d.colors.map((c) => c.name.trim().toLowerCase())).size !== d.colors.length || d.colors.some((c) => !c.name.trim())) e.colors = 'Color names must be filled and unique'
  if (d.sizes.length < 1) e.sizes = 'Add at least one size'
  return e
}
