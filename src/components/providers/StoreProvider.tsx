'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
import { coupons, products, type Product } from '@/data/catalog'
import { initializeDemoFlashSale, settings } from '@/data/site'
import type { Order, OrderItem, Source } from '@/data/orders'
import cart from '@/components/providers/store/cart.slice'
import wishlist from '@/components/providers/store/wishlist.slice'
import session from '@/components/providers/store/session.slice'
import orders from '@/components/providers/store/orders.slice'
import reviews from '@/components/providers/store/reviews.slice'
import toasts from '@/components/providers/store/toasts.slice'
import { selectCount, selectCouponDiscount, selectDeliveryFee, selectLineInfo, selectStock, selectSubtotal, stockKey } from '@/components/providers/store/selectors'
import type { StoreContext } from '@/components/providers/store/store.types'
import useNow from '@/lib/useNow'

export type { Line, User, Address } from '@/components/providers/store/types'

const C = createContext<StoreContext>(null as never)
export const useStore = () => useContext(C)

/**
 * Composes the store slices (each a Redux-Toolkit-shaped slice in ./store) behind the useStore() facade.
 * To move to Redux Toolkit: configureStore({ reducer: { cart: cart.reducer, ... } }), swap the useReducer calls for
 * useSelector/useDispatch, and keep the facade below (or inline it into hooks). Components need no change.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartState, dCart] = useReducer(cart.reducer, cart.initialState)
  const [wish, dWish] = useReducer(wishlist.reducer, wishlist.initialState)
  const [sess, dSess] = useReducer(session.reducer, session.initialState)
  const [ord, dOrd] = useReducer(orders.reducer, orders.initialState)
  const [rev, dRev] = useReducer(reviews.reducer, reviews.initialState)
  const [toastList, dToast] = useReducer(toasts.reducer, toasts.initialState)
  const now = useNow(30_000)

  useEffect(() => {
    if (now !== null) initializeDemoFlashSale(now)
  }, [now])

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random()
    dToast(toasts.actions.pushed({ id, msg }))
    setTimeout(() => dToast(toasts.actions.dismissed(id)), 2600)
  }, [])

  const { lines, coupon } = cartState
  const subtotal = selectSubtotal(lines, now ?? undefined)

  const value = useMemo<StoreContext>(() => {
    const placeOrder: StoreContext['placeOrder'] = (o) => {
      const order: Order = { ...o, id: `${settings.orders.prefix}-${10502 + ord.items.length}`, status: o.status ?? 'PENDING_CONFIRMATION', createdAt: new Date().toISOString() }
      dOrd(orders.actions.added(order))
      order.items.forEach((it) => {
        const p = products.find((x) => x.id === it.productId)
        if (p && it.size) dOrd(orders.actions.stockSet({ key: stockKey(p, it.color, it.size), value: selectStock(ord.stock, p, it.color, it.size) - it.qty }))
      })
      return order
    }
    return {
      lines, cartOpen: cartState.open, coupon, subtotal, count: selectCount(lines),
      addItem: (p: Product, color, size, qty = 1, open = true) => dCart(cart.actions.addLine({ line: { key: `${p.id}|${color}|${size}`, productId: p.id, color, size, qty }, open })),
      addCombo: (id) => dCart(cart.actions.addLine({ line: { key: `combo|${id}`, comboId: id, color: '', size: 'Choose at confirm', qty: 1 }, open: true })),
      setQty: (key, by) => dCart(cart.actions.changeQty({ key, by })),
      remove: (key) => dCart(cart.actions.removeLine(key)),
      clear: () => dCart(cart.actions.clear()),
      setCartOpen: (b) => dCart(cart.actions.setOpen(b)),
      lineInfo: (line) => selectLineInfo(line, now ?? undefined),
      applyCoupon: (code, sub) => {
        const c = coupons.find((x) => x.code === code.trim().toUpperCase())
        if (!c) return 'That coupon code does not exist.'
        if (sub < c.min) return `Minimum order for ${c.code} is ৳${c.min.toLocaleString()}.`
        dCart(cart.actions.setCoupon(c.code))
        return null
      },
      removeCoupon: () => dCart(cart.actions.setCoupon(null)),
      couponDiscount: (sub) => selectCouponDiscount(coupon, sub),
      deliveryFee: selectDeliveryFee,
      wishlist: wish.ids,
      recent: wish.recent,
      toggleWish: (id) => {
        dWish(wishlist.actions.toggle(id))
        toast(wish.ids.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist')
      },
      pushRecent: (id) => dWish(wishlist.actions.pushRecent(id)),
      user: sess.user,
      authOpen: sess.authOpen,
      setUser: (u) => dSess(session.actions.setUser(u)),
      setAuthOpen: (b) => dSess(session.actions.setAuthOpen(b)),
      orders: ord.items,
      placeOrder,
      patchOrder: (id, patch) => dOrd(orders.actions.patched({ id, patch })),
      removeOrder: (id) => dOrd(orders.actions.removed(id)),
      stockOf: (p, c, s) => selectStock(ord.stock, p, c, s),
      setStock: (p, c, s, v) => dOrd(orders.actions.stockSet({ key: stockKey(p, c, s), value: v })),
      reviews: rev.items,
      addReview: (r) => dRev(reviews.actions.added({ ...r, id: `r${Date.now()}`, createdAt: new Date().toISOString() })),
      replyToReview: (id, text) => dRev(reviews.actions.patched({ id, patch: { reply: text ? { text, at: new Date().toISOString() } : undefined } })),
      patchReview: (id, patch) => dRev(reviews.actions.patched({ id, patch })),
      removeReview: (id) => dRev(reviews.actions.removed(id)),
      toast,
    }
  }, [cartState, lines, coupon, subtotal, wish, sess, ord, rev, toast, now])

  return (
    <C.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {toastList.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="label-mono flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-background shadow-xl"
            >
              <Check size={14} className="text-accent" /> {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </C.Provider>
  )
}

export type { OrderItem, Source }
