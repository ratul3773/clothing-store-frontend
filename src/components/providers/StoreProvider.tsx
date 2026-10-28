'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { toast as sonnerToast } from 'sonner'
import { coupons, products, type Product } from '@/data/catalog'
import { initializeDemoFlashSale, settings } from '@/data/site'
import type { Order, OrderItem, Source } from '@/data/orders'
import cart from '@/components/providers/store/cart.slice'
import wishlist from '@/components/providers/store/wishlist.slice'
import session from '@/components/providers/store/session.slice'
import orders from '@/components/providers/store/orders.slice'
import reviews from '@/components/providers/store/reviews.slice'
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
  const now = useNow(30_000)

  useEffect(() => {
    if (now !== null) initializeDemoFlashSale(now)
  }, [now])

  const toast = useCallback((msg: string) => {
    sonnerToast.success(msg)
  }, [])
  const toastError = useCallback((msg: string) => {
    sonnerToast.error(msg)
  }, [])
  const pushRecent = useCallback((id: string) => {
    dWish(wishlist.actions.pushRecent(id))
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
      pushRecent,
      toggleWish: (id) => {
        dWish(wishlist.actions.toggle(id))
        toast(wish.ids.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist')
      },
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
      toastError,
    }
  }, [cartState, lines, coupon, subtotal, wish, sess, ord, rev, toast, toastError, pushRecent, now])

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  )
}

export type { OrderItem, Source }

// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useMemo,
//   useState,
//   type ReactNode,
// } from "react";

// type StoreContextType = {
//   authOpen: boolean;
//   setAuthOpen: (open: boolean) => void;
// };

// const StoreContext = createContext<StoreContextType | null>(null);

// export function useStore() {
//   const context = useContext(StoreContext);

//   if (!context) {
//     throw new Error("useStore must be used within StoreProvider");
//   }

//   return context;
// }

// export function StoreProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [authOpen, setAuthOpenState] = useState(false);

//   const setAuthOpen = useCallback((open: boolean) => {
//     setAuthOpenState(open);
//   }, []);

//   const value = useMemo(
//     () => ({
//       authOpen,
//       setAuthOpen,
//     }),
//     [authOpen, setAuthOpen],
//   );

//   return (
//     <StoreContext.Provider value={value}>
//       {children}
//     </StoreContext.Provider>
//   );
// }
