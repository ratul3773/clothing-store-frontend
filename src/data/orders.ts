import { DEMO_REFERENCE_TIME } from '@/data/demoTime'

export const LIFECYCLE = [
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'COURIER_ASSIGNED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const
export type Status = (typeof LIFECYCLE)[number] | 'CANCELLED' | 'RETURNED' | 'EXCHANGED'
export type Source = 'WEBSITE' | 'ADMIN_MANUAL' | 'WHATSAPP' | 'FACEBOOK' | 'INSTAGRAM' | 'PHONE'

export type OrderItem = { productId: string; name: string; color: string; size: string; qty: number; price: number; image: string }
export type Order = {
  id: string
  source: Source
  status: Status
  guest: boolean
  customer: { name: string; phone: string; address: string; zone: 'dhaka' | 'outside'; email?: string; note?: string }
  items: OrderItem[]
  subtotal: number
  delivery: number
  discount: number
  total: number
  payment: 'COD' | 'SSLCOMMERZ'
  courier?: 'Pathao' | 'Steadfast'
  consignment?: string
  createdAt: string
  deliveredAt?: string
  notes?: { text: string; at: string }[]
  paid?: boolean
  history?: { status: Status; at: string }[]
  exchange?: { reason: string; size: string; state: 'REQUESTED' | 'APPROVED' | 'REJECTED' }
}

export const statusLabel = (s: Status) => s.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())

const D = (n: number) => new Date(DEMO_REFERENCE_TIME - n * 864e5).toISOString()
const im = (id: string) => `https://images.unsplash.com/photo-${id}?w=300&h=375&fit=crop&auto=format&q=70`

export const seedOrders: Order[] = [
  {
    id: 'MB-10482', source: 'WEBSITE', status: 'DELIVERED', guest: false,
    customer: { name: 'Tanvir Ahmed', phone: '01712 345678', address: 'House 14, Road 7, Dhanmondi, Dhaka', zone: 'dhaka' },
    items: [{ productId: 'p1', name: 'Dhaka Oxford Shirt', color: 'Chalk White', size: 'L', qty: 1, price: 1990, image: im('1602810318383-e386cc2a3ccf') }],
    subtotal: 1990, delivery: 0, discount: 0, total: 1990, payment: 'COD', courier: 'Pathao', consignment: 'PT-8841920',
    createdAt: D(4), deliveredAt: D(2),
  },
  {
    id: 'MB-10431', source: 'FACEBOOK', status: 'DELIVERED', guest: true,
    customer: { name: 'Tanvir Ahmed', phone: '01712 345678', address: 'House 14, Road 7, Dhanmondi, Dhaka', zone: 'dhaka' },
    items: [{ productId: 'p6', name: 'Motijheel Chino', color: 'Stone', size: '32', qty: 1, price: 2490, image: im('1661784396723-86a5dda735b6') }],
    subtotal: 2490, delivery: 0, discount: 0, total: 2490, payment: 'COD', courier: 'Steadfast', consignment: 'SF-220934',
    createdAt: D(21), deliveredAt: D(18),
  },
  {
    id: 'MB-10501', source: 'WEBSITE', status: 'PENDING_CONFIRMATION', guest: true,
    customer: { name: 'Rafiq Hasan', phone: '01911 223344', address: 'Sector 11, Uttara, Dhaka', zone: 'dhaka' },
    items: [{ productId: 'p3', name: 'Monsoon Linen Shirt', color: 'Sand', size: 'M', qty: 2, price: 2390, image: im('1790065665657-718951e1a8b1') }],
    subtotal: 4780, delivery: 0, discount: 0, total: 4780, payment: 'COD', createdAt: D(0),
  },
  {
    id: 'MB-10498', source: 'WHATSAPP', status: 'CONFIRMED', guest: true,
    customer: { name: 'Nusrat Karim', phone: '01819 556677', address: 'Agrabad, Chattogram', zone: 'outside' },
    items: [{ productId: 'p7', name: 'Old Town Cargo', color: 'Moss', size: '34', qty: 1, price: 3190, image: im('1584865288642-42078afe6942') }],
    subtotal: 3190, delivery: 0, discount: 0, total: 3190, payment: 'SSLCOMMERZ', createdAt: D(1),
  },
  {
    id: 'MB-10490', source: 'INSTAGRAM', status: 'COURIER_ASSIGNED', guest: true,
    customer: { name: 'Sabbir Rahman', phone: '01611 889900', address: 'Zindabazar, Sylhet', zone: 'outside' },
    items: [{ productId: 'p2', name: 'Padma Poplin Shirt', color: 'Sky', size: 'XL', qty: 1, price: 2250, image: im('1602810316693-3667c854239a') }],
    subtotal: 2250, delivery: 0, discount: 0, total: 2250, payment: 'COD', courier: 'Steadfast', consignment: 'SF-221877', createdAt: D(2),
  },
]
