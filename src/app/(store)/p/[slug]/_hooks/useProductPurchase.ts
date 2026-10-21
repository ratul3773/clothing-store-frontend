'use client'

import { useState } from 'react'
import { useNavigate } from '@/lib/nav'
import { useStore } from '@/components/providers/StoreProvider'
import { MAX_QTY } from '@/app/(store)/p/[slug]/_constants/product.constants'
import type { Product } from '@/data/catalog'

export default function useProductPurchase(p: Product) {
  const nav = useNavigate()
  const { addItem, wishlist, toggleWish, stockOf, toast } = useStore()
  const [ci, setCi] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [shake, setShake] = useState(0)

  const color = p.colors[ci]
  const avail = size ? stockOf(p, color.name, size) : null

  const selectColor = (i: number) => { setCi(i); setSize(null) }
  const selectSize = (s: string) => { setSize(s); setQty(1) }
  const decQty = () => setQty((q) => Math.max(1, q - 1))
  const incQty = () => setQty((q) => Math.min(avail ?? MAX_QTY, q + 1))

  const add = (buy: boolean) => {
    if (!size) { setShake((s) => s + 1); toast('Choose a size first'); return false }
    if (!avail) return false
    addItem(p, color.name, size, qty, !buy)
    if (buy) nav('/checkout')
  }

  return { ci, setCi, color, size, setSize, qty, avail, shake, selectColor, selectSize, decQty, incQty, add, liked: wishlist.includes(p.id), toggleWish: () => toggleWish(p.id), stockOf }
}
