import type { Order } from '@/data/orders'

export const trackingUrl = (o: Pick<Order, 'courier' | 'consignment'>) =>
  o.courier ? (o.courier === 'Pathao' ? `https://pathao.com/track?code=${o.consignment}` : `https://steadfast.com.bd/t/${o.consignment}`) : null

export const orderHeading = (status: string, label: string) =>
  status === 'CANCELLED' ? 'Cancelled' : status === 'PENDING_CONFIRMATION' ? 'Order received' : label
