export type SortKey = 'newest' | 'name_asc' | 'name_desc' | 'low' | 'high'

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
  badge: import('@/redux/apis/types/product.types').Badge | ''
  price: [number, number] | null
  sort: string
}
