'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from '@/lib/nav'
import { useCms } from '@/lib/useCms'
import { useGetCategoriesQuery } from '@/redux/apis/category.api'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import type { Category } from '@/redux/apis/types/category.types'
import type { Badge } from '@/redux/apis/types/product.types'
import { toStorefrontProducts } from '@/lib/public-product'

export default function useProductFilters() {
  const version = useCms()
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('cat') ?? 'all'
  const q = (sp.get('q') ?? '').toLowerCase()
  const sub = sp.get('sub')
  const badgeParam = sp.get('badge') as Badge | null
  const [offersOnly, setOffersOnly] = useState(sp.get('offers') === '1')
  const [inStock, setInStock] = useState(false)
  const [badge, setBadge] = useState<Badge | ''>(badgeParam ?? '')
  const [priceSel, setPrice] = useState<[number, number] | null>(null)
  const [sort, setSort] = useState('newest')

  const apiQuery = useMemo(() => ({
    limit: 100,
    category: sub ?? (cat !== 'all' ? cat : undefined),
    q: q || undefined,
    inStock: inStock ? 'true' as const : undefined,
    offers: offersOnly ? 'true' as const : undefined,
    badge: badge || undefined,
    minPrice: priceSel?.[0],
    maxPrice: priceSel?.[1],
    sort: sort === 'low' ? 'price_asc' as const : sort === 'high' ? 'price_desc' as const : sort as 'newest' | 'name_asc' | 'name_desc',
  }), [badge, cat, inStock, offersOnly, priceSel, q, sort, sub])

  const { data: productPage, isLoading, isFetching, isError, error } = useGetProductsQuery(apiQuery)
  // const { data: catalogPage } = useGetProductsQuery({ limit: 100, sort: 'newest' })
  const { data: categoryData, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useGetCategoriesQuery()
  const products = useMemo(() => toStorefrontProducts(productPage?.items ?? []), [productPage?.items])
  // const catalogProducts = useMemo(() => toStorefrontProducts(catalogPage?.items ?? []), [catalogPage?.items])

  const categories = useMemo(() => {
    const flat = (categoryData ?? []).flatMap(function walk(category: Category): Category[] {
      return [category, ...(category.children ?? []).flatMap(walk)]
    })
    return flat.filter((category) => !category.parentId)
  }, [categoryData])

  const allCategories = useMemo(() => {
    const result = [] as NonNullable<typeof categoryData>
    const walk = (items: NonNullable<typeof categoryData>) => {
      items.forEach((category) => {
        result.push(category)
        if (category.children) walk(category.children)
      })
    }
    walk(categoryData ?? [])
    return result
  }, [categoryData])

  const subcategories = useMemo(
    () => allCategories.filter((category) => category.parentId === categories.find((item) => item.slug === cat)?.id),
    [allCategories, categories, cat],
  )

  // Until the shopper moves the slider the price filter is off, so newly created products always appear.
  const price: [number, number] = [0, 6000]
  const list = useMemo(() => products, [products, version])

  const setCat = (c: string) => { const n = new URLSearchParams(sp); c === 'all' ? n.delete('cat') : n.set('cat', c); n.delete('sub'); setSp(n) }
  const toggleSub = (s: string) => { const n = new URLSearchParams(sp); sub === s ? n.delete('sub') : n.set('sub', s); setSp(n) }
  const reset = () => { setSp({}); setOffersOnly(false); setInStock(false); setBadge(''); setPrice(null); setSort('newest') }

  const badgeOptions: Array<{ value: Badge; label: string }> = [
    { value: 'NEW', label: 'New' },
    { value: 'SALE', label: 'Sale' },
    { value: 'BEST_SELLER', label: 'Best seller' },
    { value: 'LIMITED', label: 'Limited' },
    { value: 'COMBO', label: 'Combo' },
  ]
  const categoryOptions = categories.map((category) => ({ cat: category.slug, label: category.name }))

  return { 
    cat, 
    q, 
    sub, 
    offersOnly, 
    setOffersOnly, 
    inStock, 
    setInStock, 
    badge, 
    setBadge, 
    price, 
    setPrice, 
    sort, 
    setSort, 
    list, 
    setCat, 
    toggleSub, 
    reset, 
    categories: categoryOptions, 
    subcategories, 
    badgeOptions, 
    isLoading: (isLoading || isFetching), 
    isCategoriesLoading, 
    isCategoriesError, 
    categoriesError, 
    isError, 
    error }
}
