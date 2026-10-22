import type { Color } from '@/data/catalog'

export type ProductDraft = {
  id: string
  isNew: boolean
  name: string
  slug: string
  slugTouched: boolean
  sku: string
  category: string
  sub: string
  status: 'active' | 'draft'
  badges: string[]
  price: string
  offer: string
  material: string
  fit: string
  care: string
  desc: string
  images: string[]
  colors: Color[]
  sizes: string[]
  stock: Record<string, number>
  look: string[]
  rating: number
  reviews: number
  sold: number
  custom?: boolean
}

export type ProductErrors = Partial<Record<'name' | 'slug' | 'sku' | 'category' | 'sub' | 'price' | 'offer' | 'images' | 'colors' | 'sizes', string>>

export type StockFilter = 'all' | 'low' | 'out'
export type StatusFilter = 'all' | 'active' | 'draft'
