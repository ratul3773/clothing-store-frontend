import { products, taxonomy, type Product } from '@/data/catalog'
import { deleteProduct, saveProduct, slugify, uid } from '@/data/cms'
import type { ProductDraft } from '../_types/products.types'
import { EMPTY_IMAGE } from '../_constants/products.constants'
import { normalizeStock, toNum } from '../_utils/products.utils'

export const listProducts = () => products
export const listTaxonomy = () => taxonomy
export const findProduct = (id: string) => products.find((p) => p.id === id)

export function emptyDraft(): ProductDraft {
  const t = taxonomy[0]
  return {
    id: uid('p'), isNew: true, name: '', slug: '', slugTouched: false, sku: '', category: t?.cat ?? '', sub: t?.subs[0] ?? '', status: 'draft', badges: [],
    price: '', offer: '', material: '', fit: '', care: '', desc: '', images: [EMPTY_IMAGE], colors: [{ name: 'Black', hex: '#111111', image: 0 }], sizes: [], stock: {}, look: [],
    rating: 0, reviews: 0, sold: 0,
  }
}

export const draftFromProduct = (p: Product): ProductDraft => ({
  id: p.id, isNew: false, name: p.name, slug: p.slug, slugTouched: true, sku: p.sku, category: p.category, sub: p.sub, status: p.status, badges: [...p.badges],
  price: String(p.price), offer: p.offer ? String(p.offer) : '', material: p.material, fit: p.fit, care: p.care, desc: p.desc, images: [...p.images],
  colors: p.colors.map((c) => ({ ...c })), sizes: [...p.sizes], stock: { ...p.stock }, look: [...p.look], rating: p.rating, reviews: p.reviews, sold: p.sold, custom: p.custom,
})

export const draftToProduct = (d: ProductDraft): Product => ({
  id: d.id, slug: slugify(d.slug), name: d.name.trim(), category: d.category, status: d.status, custom: d.custom, sub: d.sub,
  price: toNum(d.price), offer: d.offer.trim() === '' ? undefined : toNum(d.offer), badges: d.badges, material: d.material.trim(), fit: d.fit.trim(), care: d.care.trim(), desc: d.desc.trim(),
  images: d.images.filter((i) => i.trim()), colors: d.colors.map((c) => ({ ...c, name: c.name.trim() })), sizes: d.sizes,
  stock: normalizeStock(d.stock, d.colors.map((c) => ({ name: c.name.trim() })), d.sizes),
  rating: d.isNew ? 0 : d.rating, reviews: d.isNew ? 0 : d.reviews, sku: d.sku.trim(), look: d.look, sold: d.isNew ? 0 : d.sold,
})

export const persistProduct = (d: ProductDraft) => saveProduct(draftToProduct(d))

export function duplicateProduct(p: Product) {
  const sku = `${p.sku}-COPY`
  let slug = `${p.slug}-copy`
  let n = 2
  while (products.some((x) => x.slug === slug)) slug = `${p.slug}-copy-${n++}`
  const copy: Product = { ...p, id: uid('p'), name: `${p.name} (Copy)`, slug, sku, status: 'draft', sold: 0, rating: 0, reviews: 0, badges: [...p.badges], images: [...p.images], colors: p.colors.map((c) => ({ ...c })), sizes: [...p.sizes], stock: { ...p.stock }, look: [...p.look] }
  saveProduct(copy)
  return copy
}

export const setStatus = (ids: string[], status: Product['status']) =>
  ids.forEach((id) => {
    const p = findProduct(id)
    if (p) saveProduct({ ...p, status })
  })
export const removeMany = (ids: string[]) => ids.forEach(deleteProduct)
export { deleteProduct }
