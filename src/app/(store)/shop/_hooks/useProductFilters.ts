'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from '@/lib/nav'
import { useCms } from '@/lib/useCms'
import { useGetCategoriesQuery } from '@/redux/apis/category.api'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import type { Category } from '@/redux/apis/types/category.types'
import { priceOf } from '@/data/catalog'
import { filterAndSort } from '@/app/(store)/shop/_utils/shop.utils'
import { toStorefrontProducts } from '@/lib/public-product'

export default function useProductFilters() {
  const version = useCms()
  const [sp, setSp] = useSearchParams()
  const cat = sp.get('cat') ?? 'all'
  const q = (sp.get('q') ?? '').toLowerCase()
  const sub = sp.get('sub')
  const [offersOnly, setOffersOnly] = useState(sp.get('offers') === '1')
  const [inStock, setInStock] = useState(false)
  const [sizes, setSizes] = useState<string[]>([])
  const [priceSel, setPrice] = useState<[number, number] | null>(null)
  const [sort, setSort] = useState('featured')

  const { data: productPage, isLoading, isFetching, isError, error } = useGetProductsQuery({
    limit: 100,
    sort: 'newest',
  })
  const { data: categoryData } = useGetCategoriesQuery()
  const products = useMemo(() => toStorefrontProducts(productPage?.items ?? []), [productPage?.items])

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

  const bounds = useMemo(() => {
    const prices = products.map((product) => priceOf(product))
    if (prices.length === 0) return [0, 1000] as [number, number]
    const lo = Math.floor(Math.min(...prices) / 100) * 100
    const hi = Math.ceil(Math.max(...prices) / 100) * 100
    return [lo, Math.max(hi, lo + 100)] as [number, number]
  }, [products])
  // Until the shopper moves the slider the price filter is off, so newly created products always appear.
  const price: [number, number] = priceSel ? [Math.max(bounds[0], priceSel[0]), Math.min(bounds[1], priceSel[1])] : bounds
  const list = useMemo(
    () => {
      const category = allCategories.find((item) => item.slug === cat)
      const descendants = (item: NonNullable<typeof categoryData>[number]): string[] => [
        item.slug,
        ...(item.children ?? []).flatMap(descendants),
      ]
      const allowed = sub
        ? new Set([sub])
        : category
          ? new Set(descendants(category))
          : undefined
      const scoped = allowed ? products.filter((product) => allowed.has(product.category)) : products
      return filterAndSort(scoped, { cat: 'all', sub: null, q, offersOnly, inStock, sizes, price: priceSel, sort })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allCategories, cat, q, offersOnly, inStock, sizes, priceSel, products, sort, version],
  )

  const setCat = (c: string) => { const n = new URLSearchParams(sp); c === 'all' ? n.delete('cat') : n.set('cat', c); n.delete('sub'); setSp(n) }
  const toggleSub = (s: string) => { const n = new URLSearchParams(sp); sub === s ? n.delete('sub') : n.set('sub', s); setSp(n) }
  const toggleSize = (s: string) => setSizes((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))
  const reset = () => { setSp({}); setOffersOnly(false); setInStock(false); setSizes([]); setPrice(null) }

  const sizeOptions = useMemo(() => Array.from(new Set(products.flatMap((product) => product.sizes))), [products])
  const categoryOptions = categories.map((category) => ({ cat: category.slug, label: category.name }))

  return { cat, q, sub, offersOnly, setOffersOnly, inStock, setInStock, sizes, toggleSize, price, bounds, setPrice, sort, setSort, list, setCat, toggleSub, reset, categories: categoryOptions, subcategories, sizeOptions, isLoading: isLoading || isFetching, isError, error }
}
