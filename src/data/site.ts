export type Banner = {
  id: string
  placement: 'hero' | 'promo'
  title: string
  subtitle: string
  image: string
  ctaLabel: string
  ctaLink: string
  active: boolean
  order: number
  startsAt?: string
  endsAt?: string
}

export type FlashSale = {
  id: string
  title: string
  subtitle: string
  discountPct: number
  productIds: string[]
  startsAt: string
  endsAt: string
  enabled: boolean
}

export type Settings = {
  store: { name: string; tagline: string; email: string; phone: string; whatsapp: string; address: string }
  delivery: { dhaka: number; outside: number; freeAbove: number }
  payments: { cod: boolean; online: boolean }
  announcements: string[]
  orders: { prefix: string; exchangeDays: number; lowStock: number; autoConfirm: boolean }
  seo: { title: string; description: string }
  social: { facebook: string; instagram: string }
  admin: { name: string; email: string; password: string }
}

export const settings: Settings = {
  store: { name: 'Mohallah&Co', tagline: "Men's shirts & pants, Dhaka", email: 'hello@mohallah.co', phone: '01712 000000', whatsapp: '8801712000000', address: 'Level 4, Gulshan Avenue, Dhaka 1212' },
  delivery: { dhaka: 70, outside: 130, freeAbove: 2000 },
  payments: { cod: true, online: true },
  announcements: ['Free delivery above ৳2,000', 'Cash on delivery across Bangladesh', 'Exchange within 7 days', 'Pathao & Steadfast shipping'],
  orders: { prefix: 'MB', exchangeDays: 7, lowStock: 5, autoConfirm: false },
  seo: { title: 'Mohallah&Co — Shirts & Pants', description: "Men's shirts and pants made for Dhaka weather. Cash on delivery across Bangladesh." },
  social: { facebook: 'https://facebook.com/mohallahco', instagram: 'https://instagram.com/mohallahco' },
  admin: { name: 'Store Owner', email: 'admin@mohallah.co', password: 'admin123' },
}

export const banners: Banner[] = []

export const flashSales: FlashSale[] = [
  { id: 'f1', title: 'Monsoon Flash Sale', subtitle: 'Extra off on selected shirts. While stock lasts.', discountPct: 15, productIds: ['p2', 'p4', 'p5'], startsAt: '', endsAt: '', enabled: true },
]

export const isFlashLive = (f: FlashSale, now: number) =>
  f.enabled && !!f.startsAt && !!f.endsAt && +new Date(f.startsAt) <= now && now < +new Date(f.endsAt)

// Change notification so CMS and storefront components re-read the mutable data.
let version = 0
const listeners = new Set<() => void>()
export const subscribe = (l: () => void) => (listeners.add(l), () => void listeners.delete(l))
export const getVersion = () => version
export const emit = () => {
  version++
  listeners.forEach((l) => l())
}

export const initializeDemoFlashSale = (now: number) => {
  const sale = flashSales.find((f) => f.id === 'f1')
  if (!sale || sale.startsAt || sale.endsAt) return
  sale.startsAt = new Date(now - 864e5).toISOString()
  sale.endsAt = new Date(now + 3 * 864e5).toISOString()
  emit()
}
