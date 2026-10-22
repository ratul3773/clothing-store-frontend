import { products } from '@/data/catalog'
import type { Review } from '@/data/reviews'
import type { ReviewFilters, ReviewStatus } from '@/app/(admin)/admin/reviews/_types/review.types'

export const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n))
export const productOf = (id: string) => products.find((p) => p.id === id)
export const statusOf = (r: Review): ReviewStatus => (r.hidden ? 'Hidden' : r.reply ? 'Replied' : 'Published')
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export function filterReviews(list: Review[], f: ReviewFilters) {
  const s = f.q.trim().toLowerCase()
  return list
    .filter((r) => {
      if (s && !`${r.author} ${r.text} ${productOf(r.productId)?.name ?? ''}`.toLowerCase().includes(s)) return false
      if (f.rating && r.rating !== Number(f.rating)) return false
      if (f.status && statusOf(r) !== f.status) return false
      if (f.product && r.productId !== f.product) return false
      if (f.images && (f.images === 'yes') !== r.images.length > 0) return false
      if (f.reply && (f.reply === 'replied') !== !!r.reply) return false
      return true
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
