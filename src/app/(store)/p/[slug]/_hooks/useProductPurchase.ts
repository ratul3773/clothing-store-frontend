'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useStore } from '@/components/providers/StoreProvider'
import useCart from '@/hooks/useCart'
import useQuantityDraft from '@/hooks/useQuantityDraft'
import { openCartDrawer } from '@/lib/cart-ui'
import type { Product } from '@/data/catalog'

const stockOf = (product: Product, color: string, size: string) => product.variants?.find((variant) => variant.colorName === color && variant.size === size)?.available ?? 0

export default function useProductPurchase(p: Product) {
  const { wishlist, toggleWish } = useStore()
  const { cart, edit, reload } = useCart()
  const [ci, setCi] = useState(0)
  const [size, setSize] = useState<string | null>(null)
  const [shake, setShake] = useState(0)
  const [adding, setAdding] = useState(false)
  const addingRef = useRef(false)
  const color = p.colors[ci] ?? { name: '', hex: '#d6d3d1', image: -1 }
  const variant = p.variants?.find((item) => item.colorName === color.name && item.size === size)
  const avail = size ? variant?.available ?? 0 : null
  const existing = cart.lines.find((item) => item.variantId === variant?.id)
  const draft = useQuantityDraft(`${cart.identityKey}:${variant?.id ?? `${p.id}:${ci}:${size}`}`, existing?.quantity ?? 1)
  const maxQuantity = existing ? existing.maxQuantity : avail ?? 0
  const quantity = existing ? draft.quantity : Math.min(draft.quantity, Math.max(1, maxQuantity))
  const selectColor = (index: number) => { setCi(index); setSize(null) }
  const selectSize = (value: string) => { setSize(value) }
  const chooseQuantity = draft.setQuantity
  const decQty = () => chooseQuantity(Math.max(1, quantity - 1))
  const incQty = () => { if (quantity < maxQuantity) chooseQuantity(quantity + 1) }
  const changed = !existing || quantity !== existing.quantity
  const validQuantity = quantity >= 1 && (quantity <= maxQuantity || !!existing && quantity < existing.quantity)

  const add = async (buy: boolean) => {
    if (buy) return false // Checkout deliberately has no demo-order fallback.
    if (!size) { setShake((value) => value + 1); toast.error('Choose a size first'); return false }
    if (!variant || !changed || !validQuantity || !cart.ready || cart.loading || cart.busy || addingRef.current) return false
    addingRef.current = true
    setAdding(true)
    try {
      const success = existing
        ? await edit({ type: 'quantity', id: existing.id, quantity })
        : await edit({ type: 'add', variantId: variant.id, quantity })
      // Account hooks ignore completions from a superseded identity.
      if (success) { openCartDrawer(); toast.success(existing ? 'Cart updated' : 'Added to your bag') }
      return success
    } finally { addingRef.current = false; setAdding(false) }
  }

  return { ci, setCi, color, size, setSize: selectSize, qty: quantity, avail, shake, selectColor, selectSize, decQty, incQty, add, liked: wishlist.includes(p.id), toggleWish: () => toggleWish(p.id), stockOf, adding, error: cart.error, reload,
    isInCart: !!existing,
    canAdd: cart.ready && !cart.loading && !cart.busy && !adding && changed && (!!size ? !!variant && validQuantity : !!p.variants?.length),
    canIncrease: maxQuantity > quantity && !cart.busy, canDecrease: quantity > 1 && !cart.busy }
}
