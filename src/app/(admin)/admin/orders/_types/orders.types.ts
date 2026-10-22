import type { Order, Source, Status } from '@/data/orders'

export type OrderFilters = {
  q: string
  status: '' | Status
  source: '' | Source
  payment: '' | Order['payment']
  courier: '' | 'Pathao' | 'Steadfast' | 'none'
  from: string
  to: string
}

export type ManualLine = { key: string; productId: string; color: string; size: string; qty: number }

export type ManualDraft = {
  name: string
  phone: string
  address: string
  zone: 'dhaka' | 'outside'
  source: Source
  payment: Order['payment']
  paid: boolean
  status: Status
  discount: string
  deliveryOverride: string
  lines: ManualLine[]
}
