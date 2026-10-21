export type ReviewStatus = 'Published' | 'Hidden' | 'Replied'

export type ReviewFilters = {
  q: string
  rating: string
  status: string
  product: string
  images: string
  reply: string
}
