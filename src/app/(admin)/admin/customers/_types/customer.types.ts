import type { Order } from '@/data/orders'

export type Segment = 'New' | 'Repeat' | 'VIP' | 'Guest-only'

export type Customer = {
  key: string
  name: string
  phone: string
  email: string
  addresses: string[]
  orders: Order[]
  orderCount: number
  spend: number
  aov: number
  lastOrder: string
  firstOrder: string
  segment: Segment
  blocked: boolean
  tags: string[]
  note: string
}

export type SortKey = 'spend' | 'orders' | 'recent'
