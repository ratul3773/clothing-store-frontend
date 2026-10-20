'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from '@/lib/nav'
import { useCms } from '@/lib/useCms'
import { getPriceBounds, getProducts } from '@/app/(store)/shop/_services/product.api'
import { filterAndSort } from '@/app/(store)/shop/_utils/shop.utils'

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bounds = useMemo(() => getPriceBounds(), [version])
  // Until the shopper moves the slider the price filter is off, so newly created products always appear.
  const price: [number, number] = priceSel ? [Math.max(bounds[0], priceSel[0]), Math.min(bounds[1], priceSel[1])] : bounds
  const list = useMemo(
    () => filterAndSort(getProducts(), { cat, sub, q, offersOnly, inStock, sizes, price: priceSel, sort }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cat, sub, q, offersOnly, inStock, sizes, priceSel, sort, version],
  )

  const setCat = (c: string) => { const n = new URLSearchParams(sp); c === 'all' ? n.delete('cat') : n.set('cat', c); n.delete('sub'); setSp(n) }
  const toggleSub = (s: string) => { const n = new URLSearchParams(sp); sub === s ? n.delete('sub') : n.set('sub', s); setSp(n) }
  const toggleSize = (s: string) => setSizes((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))
  const reset = () => { setSp({}); setOffersOnly(false); setInStock(false); setSizes([]); setPrice(null) }

  return { cat, q, sub, offersOnly, setOffersOnly, inStock, setInStock, sizes, toggleSize, price, bounds, setPrice, sort, setSort, list, setCat, toggleSub, reset }
}
