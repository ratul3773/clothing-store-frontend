import type { SortOption } from '@/app/(store)/shop/_types/shop.types'

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
]
