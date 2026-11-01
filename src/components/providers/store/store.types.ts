import type { Product } from '@/data/catalog'
import type { Review } from '@/data/reviews'
import type { Order } from '@/data/orders'
import type { User } from './types'

export type StoreContext = {
  wishlist: string[]
  toggleWish: (id: string) => void
  recent: string[]
  pushRecent: (id: string) => void
  user: User | null
  setUser: (u: User | null) => void
  authOpen: boolean
  setAuthOpen: (b: boolean) => void
  orders: Order[]
  placeOrder: (o: Omit<Order, 'id' | 'createdAt' | 'status'> & { status?: Order['status'] }) => Order
  patchOrder: (id: string, patch: Partial<Order>) => void
  removeOrder: (id: string) => void
  stockOf: (p: Product, color: string, size: string) => number
  setStock: (p: Product, color: string, size: string, v: number) => void
  reviews: Review[]
  addReview: (r: Omit<Review, 'id' | 'createdAt'>) => void
  replyToReview: (id: string, text: string | null) => void
  patchReview: (id: string, patch: Partial<Review>) => void
  removeReview: (id: string) => void
  toast: (msg: string) => void
  toastError: (msg: string) => void
}
