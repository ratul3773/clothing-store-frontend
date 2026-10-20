export const FIT_PREFERENCES = ['slim', 'regular', 'loose']

export const FIT_FEEL = [
  { label: 'Smaller', value: 14 },
  { label: 'Perfect', value: 78 },
  { label: 'Larger', value: 8 },
]

import { settings } from '@/data/site'
import { bdt } from '@/lib/utils'

export const deliveryInfo = () =>
  `${bdt(settings.delivery.dhaka)} inside Dhaka, ${bdt(settings.delivery.outside)} outside, free above ${bdt(settings.delivery.freeAbove)}. Reject at the door if unsatisfied. Exchange within ${settings.orders.exchangeDays} days of delivery, subject to replacement stock.`

export const LOW_STOCK_THRESHOLD = 3
export const MAX_QTY = 9
