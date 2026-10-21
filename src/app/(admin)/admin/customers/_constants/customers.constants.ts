import type { Segment, SortKey } from '@/app/(admin)/admin/customers/_types/customer.types'

export const SEGMENTS: Segment[] = ['New', 'Repeat', 'VIP', 'Guest-only']
export const SORTS: { value: SortKey; label: string }[] = [
  { value: 'spend', label: 'Highest spend' },
  { value: 'orders', label: 'Most orders' },
  { value: 'recent', label: 'Most recent' },
]
export const VIP_ORDERS = 3
export const VIP_SPEND = 10000
