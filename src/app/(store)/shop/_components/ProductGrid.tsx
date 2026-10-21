'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Pagination } from '@/components/ui/pagination'
import usePagination from '@/lib/usePagination'
import { useCms } from '@/lib/useCms'
import ProductCard from '@/components/common/ProductCard'
import EmptyState from '@/app/(store)/shop/_components/EmptyState'
import type { Product } from '@/data/catalog'

const PAGE_SIZE = 6

export default function ProductGrid({ list, onClear }: { list: Product[]; onClear: () => void }) {
  useCms()
  const pg = usePagination(list, PAGE_SIZE, list.map((p) => p.id).join())
  if (list.length === 0) return <EmptyState onClear={onClear} />
  return (
    <>
      <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {pg.pageItems.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </AnimatePresence>
      </motion.div>
      <Pagination page={pg.page} pageCount={pg.pageCount} onChange={pg.setPage} id="pg-shop" />
    </>
  )
}
