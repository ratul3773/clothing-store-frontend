import { products, sizeChart, taxonomy, type Taxon } from '@/data/catalog'
import { deleteCategory, emit, renameSub, saveCategory } from '@/data/cms'
import type { SizeRow } from '../_types/categories.types'

export const listCategories = () => taxonomy
export const countProducts = (cat: string, sub?: string) => products.filter((p) => p.category === cat && (!sub || p.sub === sub)).length

export const defaultSizeRows = (): SizeRow[] => ['S', 'M', 'L', 'XL'].map((size) => ({ size, a: '', b: '', c: '' }))

/** Creates a category and seeds a default size chart for it. */
export function createCategory(t: Taxon) {
  saveCategory(t)
  if (!sizeChart[t.cat]) {
    sizeChart[t.cat] = defaultSizeRows()
    emit()
  }
}

/** Updates a category; a renamed key remaps products (via saveCategory) and moves the size chart. */
export function updateCategory(t: Taxon, prevCat: string) {
  if (prevCat !== t.cat && sizeChart[prevCat]) {
    sizeChart[t.cat] = sizeChart[prevCat]
    delete sizeChart[prevCat]
  }
  saveCategory(t, prevCat)
}

export function removeCategory(cat: string): string | null {
  const n = countProducts(cat)
  if (n > 0) return `Cannot delete: ${n} product${n === 1 ? '' : 's'} still use this category. Move or delete them first.`
  deleteCategory(cat)
  delete sizeChart[cat]
  emit()
  return null
}

export const addSub = (t: Taxon, name: string) => saveCategory({ ...t, subs: [...t.subs, name.trim()] }, t.cat)
export const renameSubcategory = (cat: string, from: string, to: string) => renameSub(cat, from, to.trim())
export function removeSub(t: Taxon, sub: string): string | null {
  const n = countProducts(t.cat, sub)
  if (n > 0) return `Cannot delete: ${n} product${n === 1 ? '' : 's'} use "${sub}".`
  saveCategory({ ...t, subs: t.subs.filter((s) => s !== sub) }, t.cat)
  return null
}

export const getSizeChart = (cat: string): SizeRow[] => sizeChart[cat] ?? []
export function saveSizeChart(cat: string, rows: SizeRow[]) {
  sizeChart[cat] = rows.filter((r) => r.size.trim()).map((r) => ({ size: r.size.trim(), a: r.a.trim(), b: r.b.trim(), c: r.c.trim() }))
  emit()
}
