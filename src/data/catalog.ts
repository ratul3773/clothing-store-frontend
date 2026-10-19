import { flashSales, isFlashLive, settings } from '@/data/site'

export type Color = { name: string; hex: string; image: number }
export type Product = {
  id: string
  slug: string
  name: string
  category: string
  status: 'active' | 'draft'
  custom?: boolean
  sub: string
  price: number
  offer?: number
  badges: string[]
  material: string
  fit: string
  care: string
  desc: string
  images: string[]
  colors: Color[]
  sizes: string[]
  stock: Record<string, number>
  rating: number
  reviews: number
  sku: string
  look: string[]
  sold: number
}

const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${Math.round(w * 1.25)}&fit=crop&auto=format&q=80`

const SHIRT = ['S', 'M', 'L', 'XL', 'XXL']
const PANT = ['30', '32', '34', '36', '38']

function stockFor(colors: Color[], sizes: string[], seed: number) {
  const s: Record<string, number> = {}
  colors.forEach((c, ci) =>
    sizes.forEach((z, zi) => {
      const v = (seed * 7 + ci * 5 + zi * 3) % 9
      s[`${c.name}|${z}`] = v < 2 ? 0 : v < 4 ? v - 1 : v + 3
    }),
  )
  return s
}

const mk = (p: Omit<Product, 'stock' | 'status'>, seed: number): Product => ({ ...p, status: 'active', stock: stockFor(p.colors, p.sizes, seed) })

export const products: Product[] = [
  mk(
    {
      id: 'p1', slug: 'dhaka-oxford-white', name: 'Dhaka Oxford Shirt', category: 'shirts', sub: 'Formal', price: 2450, offer: 1990,
      badges: ['SALE', 'BEST SELLER'], material: '100% combed cotton Oxford, 140 GSM', fit: 'Regular fit',
      care: 'Machine wash cold. Iron on medium. Do not bleach.',
      desc: 'A crisp button-down woven for Dhaka humidity. Soft collar roll, mother-of-pearl buttons and a sturdy double-needle finish.',
      images: [img('1602810318383-e386cc2a3ccf'), img('1602810316498-ab67cf68c8e1')],
      colors: [{ name: 'Chalk White', hex: '#f1ede2', image: 0 }, { name: 'Bone', hex: '#d9cfb8', image: 1 }],
      sizes: SHIRT, rating: 4.8, reviews: 214, sku: 'SH-OX-001', look: ['p6', 'p7'], sold: 812,
    }, 1),
  mk(
    {
      id: 'p2', slug: 'padma-blue-poplin', name: 'Padma Poplin Shirt', category: 'shirts', sub: 'Formal', price: 2250,
      badges: ['NEW'], material: 'Cotton poplin, 120 GSM', fit: 'Slim fit',
      care: 'Machine wash cold. Cool iron.',
      desc: 'River-blue poplin with a clean spread collar. Light enough for office days, sharp enough for dinner.',
      images: [img('1602810316693-3667c854239a'), img('1623658580851-3b25bf83b4ea')],
      colors: [{ name: 'Padma Blue', hex: '#5f86b8', image: 0 }, { name: 'Sky', hex: '#a9c4e4', image: 1 }],
      sizes: SHIRT, rating: 4.6, reviews: 98, sku: 'SH-PO-002', look: ['p6', 'p8'], sold: 430,
    }, 2),
  mk(
    {
      id: 'p3', slug: 'monsoon-linen-camp', name: 'Monsoon Linen Shirt', category: 'shirts', sub: 'Casual', price: 2790, offer: 2390,
      badges: ['SALE', 'LIMITED'], material: 'Linen-cotton blend, 150 GSM', fit: 'Relaxed fit',
      care: 'Hand wash or gentle cycle. Dry in shade.',
      desc: 'Breathable linen blend with a textured hand. Gets better with every wash, which is the whole point.',
      images: [img('1790065665657-718951e1a8b1'), img('1645857196231-7fafec18ff12')],
      colors: [{ name: 'Sand', hex: '#cdbb98', image: 0 }, { name: 'Olive', hex: '#6a6f48', image: 1 }],
      sizes: SHIRT, rating: 4.9, reviews: 156, sku: 'SH-LN-003', look: ['p7', 'p9'], sold: 560,
    }, 3),
  mk(
    {
      id: 'p4', slug: 'rajshahi-silk-polo', name: 'Rajshahi Polo', category: 'shirts', sub: 'Polo', price: 1650,
      badges: [], material: 'Pique cotton, 210 GSM', fit: 'Regular fit',
      care: 'Machine wash cold, inside out.',
      desc: 'A weighty pique polo with tipped collar and a clean two-button placket. Holds its shape through a long day.',
      images: [img('1623658580851-3b25bf83b4ea'), img('1602810320073-1230c46d89d4')],
      colors: [{ name: 'Cobalt', hex: '#3a62a8', image: 0 }, { name: 'Ink', hex: '#1b1f1d', image: 1 }],
      sizes: SHIRT, rating: 4.4, reviews: 61, sku: 'SH-PL-004', look: ['p6'], sold: 210,
    }, 4),
  mk(
    {
      id: 'p5', slug: 'sylhet-check-flannel', name: 'Sylhet Check Shirt', category: 'shirts', sub: 'Casual', price: 2150,
      badges: ['NEW'], material: 'Brushed cotton, 160 GSM', fit: 'Regular fit',
      care: 'Machine wash cold. Tumble low.',
      desc: 'Soft brushed cotton in a quiet tonal check. Wear it open over a tee or buttoned to the collar.',
      images: [img('1709004915865-38bc70f4cb78'), img('1602810319428-019690571b5b')],
      colors: [{ name: 'Forest', hex: '#2f4a3c', image: 0 }, { name: 'Rust', hex: '#a24a2a', image: 1 }],
      sizes: SHIRT, rating: 4.5, reviews: 44, sku: 'SH-FL-005', look: ['p8'], sold: 175,
    }, 5),
  mk(
    {
      id: 'p6', slug: 'motijheel-slim-chino', name: 'Motijheel Chino', category: 'pants', sub: 'Chino', price: 2890, offer: 2490,
      badges: ['SALE', 'BEST SELLER'], material: 'Stretch twill, 98% cotton 2% elastane', fit: 'Slim tapered',
      care: 'Machine wash cold. Iron on reverse.',
      desc: 'The everyday chino, cut slim through the thigh with a clean taper. Two-way stretch for rickshaw rides and long meetings.',
      images: [img('1661784396787-2a43e31a5689'), img('1661784396723-86a5dda735b6')],
      colors: [{ name: 'Charcoal', hex: '#2d312f', image: 0 }, { name: 'Stone', hex: '#b9ac92', image: 1 }],
      sizes: PANT, rating: 4.7, reviews: 188, sku: 'PN-CH-006', look: ['p1', 'p2'], sold: 690,
    }, 6),
  mk(
    {
      id: 'p7', slug: 'old-town-cargo', name: 'Old Town Cargo', category: 'pants', sub: 'Cargo', price: 3190, badges: ['NEW', 'LIMITED'],
      material: 'Cotton ripstop, 220 GSM', fit: 'Relaxed straight',
      care: 'Machine wash cold. Line dry.',
      desc: 'Six-pocket cargo in tough ripstop with bartacked stress points. Utility without the bulk.',
      images: [img('1584865288642-42078afe6942'), img('1706287043719-3fad472e98a6')],
      colors: [{ name: 'Moss', hex: '#4d5a3f', image: 0 }, { name: 'Black', hex: '#161a18', image: 1 }],
      sizes: PANT, rating: 4.6, reviews: 72, sku: 'PN-CG-007', look: ['p3', 'p5'], sold: 305,
    }, 7),
  mk(
    {
      id: 'p8', slug: 'gulshan-pleated-trouser', name: 'Gulshan Trouser', category: 'pants', sub: 'Formal', price: 3490, badges: ['COMBO'],
      material: 'Wool-blend suiting, 260 GSM', fit: 'Straight, single pleat',
      care: 'Dry clean recommended.',
      desc: 'Single-pleat formal trouser with a high rise and side adjusters. Drapes beautifully, no belt required.',
      images: [img('1545272957-4a9a90740ce1'), img('1661784396825-3a823effaf87')],
      colors: [{ name: 'Slate', hex: '#4a5058', image: 0 }, { name: 'Navy', hex: '#1f2b45', image: 1 }],
      sizes: PANT, rating: 4.8, reviews: 53, sku: 'PN-TR-008', look: ['p2', 'p5'], sold: 140,
    }, 8),
  mk(
    {
      id: 'p9', slug: 'banani-jogger-chino', name: 'Banani Jogger Chino', category: 'pants', sub: 'Casual', price: 2390, offer: 1990, badges: ['SALE'],
      material: 'Stretch cotton, 200 GSM', fit: 'Tapered, elastic cuff',
      care: 'Machine wash cold.',
      desc: 'Smart enough for the office, comfortable enough for the flight home. Drawcord waist, clean cuffs.',
      images: [img('1661784396787-2a43e31a5689'), img('1584865288642-42078afe6942')],
      colors: [{ name: 'Khaki', hex: '#a8946b', image: 0 }, { name: 'Graphite', hex: '#3a3e3c', image: 1 }],
      sizes: PANT, rating: 4.3, reviews: 39, sku: 'PN-JG-009', look: ['p3'], sold: 98,
    }, 9),
]

export const bySlug = (s?: string) => products.find((p) => p.slug === s)
export const byId = (id: string) => products.find((p) => p.id === id)!
export const activeFlash = (p: Product, now?: number) =>
  now === undefined ? undefined : flashSales.find((f) => isFlashLive(f, now) && f.productIds.includes(p.id))
export const priceOf = (p: Product, now?: number) => {
  const base = p.offer ?? p.price
  const f = activeFlash(p, now)
  return f ? Math.round(base * (1 - f.discountPct / 100)) : base
}
export const stockOf = (p: Product, color: string, size: string) => p.stock[`${color}|${size}`] ?? 0
export const totalStock = (p: Product) => Object.values(p.stock).reduce((a, b) => a + b, 0)

export const sizeChart: Record<string, { size: string; a: string; b: string; c: string }[]> = {
  shirts: [
    { size: 'S', a: '38"', b: '27"', c: '16.5"' },
    { size: 'M', a: '40"', b: '28"', c: '17.5"' },
    { size: 'L', a: '42"', b: '29"', c: '18.5"' },
    { size: 'XL', a: '44"', b: '30"', c: '19.5"' },
    { size: 'XXL', a: '46"', b: '31"', c: '20.5"' },
  ],
  pants: [
    { size: '30', a: '30"', b: '40"', c: '8.0"' },
    { size: '32', a: '32"', b: '40.5"', c: '8.25"' },
    { size: '34', a: '34"', b: '41"', c: '8.5"' },
    { size: '36', a: '36"', b: '41.5"', c: '8.75"' },
    { size: '38', a: '38"', b: '42"', c: '9.0"' },
  ],
}

export type Combo = { id: string; name: string; tag: string; items: { id: string; color: number; size?: string }[]; price: number; image: string }
export const combos: Combo[] = [
  { id: 'c1', name: 'The Office Pair', tag: 'Oxford + Chino', items: [{ id: 'p1', color: 0 }, { id: 'p6', color: 0 }], price: 3990, image: img('1661784396723-86a5dda735b6', 800) },
  { id: 'c2', name: 'Weekend Utility', tag: 'Linen + Cargo', items: [{ id: 'p3', color: 1 }, { id: 'p7', color: 0 }], price: 4990, image: img('1584865288642-42078afe6942', 800) },
  { id: 'c3', name: 'Dinner Ready', tag: 'Poplin + Trouser', items: [{ id: 'p2', color: 0 }, { id: 'p8', color: 1 }], price: 4990, image: img('1602810316693-3667c854239a', 800) },
]

export const coupons = [
  { code: 'WELCOME10', type: 'pct' as const, value: 10, min: 1500, max: 400, note: '10% off, up to ৳400, min order ৳1,500' },
  { code: 'EID200', type: 'fix' as const, value: 200, min: 2500, max: 200, note: '৳200 off orders above ৳2,500' },
]

export const DELIVERY = {
  get dhaka() { return settings.delivery.dhaka },
  get outside() { return settings.delivery.outside },
}
export const hero = img('1645857196231-7fafec18ff12', 1100)
export const heroAlt = img('1661784396787-2a43e31a5689', 900)

export type Taxon = { cat: string; label: string; blurb: string; image: string; subs: string[] }
export const taxonomy: Taxon[] = [
  { cat: 'shirts', label: 'Shirts', blurb: 'Oxford, poplin, linen and pique for hot, humid days.', image: img('1790065665657-718951e1a8b1', 500), subs: ['Formal', 'Casual', 'Polo'] },
  { cat: 'pants', label: 'Pants', blurb: 'Chinos, cargos and trousers with a clean taper.', image: img('1661784396723-86a5dda735b6', 500), subs: ['Chino', 'Cargo', 'Formal', 'Casual'] },
]
