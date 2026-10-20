import type { SortOption } from '@/app/(store)/shop/_types/shop.types'

export const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Best selling' },
  { value: 'low', label: 'Price: low to high' },
  { value: 'high', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]
