'use client'

import { PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'
import ReviewCard from '@/components/common/ReviewCard'
import { useStore } from '@/components/providers/StoreProvider'
import usePagination from '@/lib/usePagination'
import { findProduct } from '@/lib/storefront'
import type { Order } from '@/data/orders'
import type useReviewForm from '@/app/(store)/account/_hooks/useReviewForm'

const PAGE_SIZE = 4

export default function ReviewsTab({ delivered, form }: { delivered: Order[]; form: ReturnType<typeof useReviewForm> }) {
  const { reviews } = useStore()
  const rows = delivered.flatMap((order) => order.items.map((item) => ({ order, item, review: reviews.find((r) => r.orderId === order.id && r.productId === item.productId) })))
  const pg = usePagination(rows, PAGE_SIZE)

  if (!rows.length) return <p className="text-muted-foreground">Once an order is delivered you can review its products here.</p>
  return (
    <div>
      <p className="label-mono mb-4 text-muted-foreground">{rows.filter((r) => !r.review).length} waiting for your review</p>
      <div className="space-y-4">
        {pg.pageItems.map(({ order, item, review }) =>
          review ? (
            <ReviewCard key={review.id} r={review} showProduct />
          ) : (
            <div key={`${order.id}-${item.productId}`} className="flex flex-wrap items-center gap-4 rounded-[3px] border border-dashed border-accent bg-accent/5 p-5">
              <img src={item.image} alt="" className="h-20 w-16 rounded-[2px] object-cover" />
              <div className="min-w-40 flex-1"><p className="font-semibold">{findProduct(item.productId)?.name ?? item.name}</p><p className="label-mono text-muted-foreground">{order.id} · {[item.color, item.size].filter(Boolean).join(' · ')}</p></div>
              <Button size="sm" variant="accent" onClick={() => form.open({ order, item })}><PenLine size={14} /> Write a review</Button>
            </div>
          ),
        )}
      </div>
      <Pagination page={pg.page} pageCount={pg.pageCount} onChange={pg.setPage} id="pg-reviews" />
    </div>
  )
}
