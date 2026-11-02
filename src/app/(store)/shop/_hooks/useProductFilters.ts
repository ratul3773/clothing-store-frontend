'use client'

import { useMemo } from 'react'
import { useSearchParams } from '@/lib/nav'
import { useGetCategoriesQuery } from '@/redux/apis/category.api'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import type { Badge } from '@/redux/apis/types/product.types'
import { toStorefrontProducts } from '@/lib/public-product'

const PRICE_RANGE: [number, number] = [0, 6000]

const BADGE_OPTIONS: Array<{ value: Badge; label: string }> = [
  { value: 'NEW', label: 'New' },
  { value: 'SALE', label: 'Sale' },
  { value: 'BEST_SELLER', label: 'Best seller' },
  { value: 'LIMITED', label: 'Limited' },
  { value: 'COMBO', label: 'Combo' },
]

const SORT_TO_API = { low: 'price_asc', high: 'price_desc' } as const

const toInt = (value: string | null, fallback: number, max = Infinity) => {
  const n = Number(value)
  return Number.isSafeInteger(n) && n > 0 && n <= max ? n : fallback
}

type Changes = Record<string, string | number | null>

export default function useProductFilters() {
  const [sp, setSp] = useSearchParams()

  // ---- read everything from the URL ----
  const page = toInt(sp.get('page'), 1)
  const limit = toInt(sp.get('limit'), 6, 100)
  const cat = sp.get('cat') ?? 'all'
  const sub = sp.get('sub')
  const q = (sp.get('q') ?? '').toLowerCase()
  const offersOnly = sp.get('offers') === '1'
  const inStock = sp.get('stock') === '1'
  const badge = (sp.get('badge') ?? '') as Badge | ''
  const sort = sp.get('sort') ?? 'newest'
  const min = sp.get('min')
  const max = sp.get('max')
  const priceSel: [number, number] | null = min && max ? [Number(min), Number(max)] : null

  // ---- one writer: set/delete params, go back to page 1 unless told otherwise ----
  const update = (changes: Changes, keepPage = false) => {
    const next = new URLSearchParams(sp)
    Object.entries(changes).forEach(([key, value]) =>
      value === null ? next.delete(key) : next.set(key, String(value)),
    )
    if (!keepPage) next.set('page', '1')
    setSp(next)
  }

  // ---- data ----
  const { currentData: productPage, isLoading, isFetching, isError, error } = useGetProductsQuery({
    page,
    limit,
    category: sub ?? (cat !== 'all' ? cat : undefined),
    q: q || undefined,
    inStock: inStock ? 'true' : undefined,
    offers: offersOnly ? 'true' : undefined,
    badge: badge || undefined,
    minPrice: priceSel?.[0],
    maxPrice: priceSel?.[1],
    sort: (SORT_TO_API[sort as keyof typeof SORT_TO_API] ?? sort) as
      'newest' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc',
  })
  const {
    data: categoryData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery()

  const list = useMemo(() => toStorefrontProducts(productPage?.items ?? []), [productPage?.items])

  const rootCategories = useMemo(
    () => (categoryData ?? []).filter((c) => !c.parentId),
    [categoryData],
  )
  const categories = useMemo(
    () => rootCategories.map((c) => ({ cat: c.slug, label: c.name })),
    [rootCategories],
  )
  const subcategories = rootCategories.find((c) => c.slug === cat)?.children ?? []

  return {
    // values
    cat, q, sub, offersOnly, inStock, badge, sort,
    price: priceSel ?? PRICE_RANGE,
    list,
    paginationInfo: productPage?.meta,
    categories,
    subcategories,
    badgeOptions: BADGE_OPTIONS,

    // setters
    setOffersOnly: (v: boolean) => update({ offers: v ? '1' : null }),
    setInStock: (v: boolean) => update({ stock: v ? '1' : null }),
    setBadge: (v: Badge | '') => update({ badge: v || null }),
    setSort: (v: string) => update({ sort: v }),
    setPrice: ([lo, hi]: [number, number]) => update({ min: lo, max: hi }),
    setPage: (p: number) => update({ page: p }, true),
    setLimit: (l: number) => update({ limit: l }),
    setCat: (c: string) => update({ cat: c === 'all' ? null : c, sub: null }),
    toggleSub: (s: string) => update({ sub: sub === s ? null : s }),
    reset: () => setSp({ page: '1', limit: String(limit) }),

    // status
    isLoading: isLoading || isFetching,
    isError, error,
    isCategoriesLoading, isCategoriesError, categoriesError,
  }
}