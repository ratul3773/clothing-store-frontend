export type SortKey = 'featured' | 'low' | 'high' | 'rating'

export interface SortOption {
  value: SortKey
  label: string
}

export interface ShopFilterState {
  cat: string
  q: string
  sub: string | null
  offersOnly: boolean
  inStock: boolean
  sizes: string[]
  price: [number, number] | null
  sort: string
}
