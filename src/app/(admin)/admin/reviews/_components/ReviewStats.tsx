import { StatCard } from '@/components/cms/ui'
import type { Review } from '@/data/reviews'

export default function ReviewStats({ reviews }: { reviews: Review[] }) {
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2) : '0.00'
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard label="Total reviews" value={reviews.length} />
      <StatCard label="Average rating" value={`${avg} ★`} />
      <StatCard label="Unreplied" value={reviews.filter((r) => !r.reply).length} />
      <StatCard label="1–2★ reviews" value={reviews.filter((r) => r.rating <= 2).length} tone="bad" hint="Needs attention" />
    </div>
  )
}
