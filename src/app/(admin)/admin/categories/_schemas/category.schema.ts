import type { Taxon } from '@/data/catalog'
import type { CategoryDraft, CategoryErrors } from '../_types/categories.types'

export function validateCategory(d: CategoryDraft, all: Taxon[], prevCat?: string): CategoryErrors {
  const e: CategoryErrors = {}
  if (!d.label.trim()) e.label = 'Label is required'
  if (!d.cat.trim()) e.cat = 'Key is required'
  else if (all.some((t) => t.cat === d.cat && t.cat !== prevCat)) e.cat = 'This key is already used by another category'
  return e
}

export function validateSubName(name: string, subs: string[], current?: string): string | undefined {
  const n = name.trim()
  if (!n) return 'Name is required'
  if (subs.some((s) => s.toLowerCase() === n.toLowerCase() && s !== current)) return 'Subcategory already exists'
  return undefined
}
