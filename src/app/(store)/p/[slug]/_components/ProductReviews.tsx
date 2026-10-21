'use client'

import { motion } from 'motion/react'
import { Pagination } from '@/components/ui/pagination'
import ReviewCard from '@/components/common/ReviewCard'
import { useStore } from '@/components/providers/StoreProvider'
import usePagination from '@/lib/usePagination'
import { visibleReviews } from '@/lib/storefront'
import type { Product } from '@/data/catalog'
import { FIT_FEEL } from '@/app/(store)/p/[slug]/_constants/product.constants'

export default function ProductReviews({ p }: { p: Product }) {
  const { reviews } = useStore()
  const mine = visibleReviews(reviews).filter((r) => r.productId === p.id)
  const pg = usePagination(mine, 3, p.id)
  return (
    <div className="space-y-3">
      {FIT_FEEL.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-3 text-sm"><span className="w-16">{label}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10"><motion.div className="h-full bg-accent" initial={{ width: 0 }} whileInView={{ width: `${value}%` }} transition={{ duration: 1 }} /></div><span className="label-mono w-10 text-right">{value}%</span></div>
      ))}
      <div className="space-y-3 border-t border-border pt-4">
        {mine.length === 0 && <p className="text-sm text-muted-foreground">No written reviews yet. Buyers can review from their account after delivery.</p>}
        {pg.pageItems.map((r) => <ReviewCard key={r.id} r={r} />)}
      </div>
      <Pagination page={pg.page} pageCount={pg.pageCount} onChange={pg.setPage} id="pg-pdp" className="mt-4" />
    </div>
  )
}
