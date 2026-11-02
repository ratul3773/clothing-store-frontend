'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useCms } from '@/lib/useCms'
import ProductCard from '@/components/common/ProductCard'
import EmptyState from '@/app/(store)/shop/_components/EmptyState'
import type { Product } from '@/data/catalog'
import ProductGridSkeleton from '@/components/common/ProductSkeleton/ProductGridSkeleton'


export default function ProductGrid({ list, onClear, loading, error }: { list: Product[]; onClear: () => void; loading?: boolean; error?: unknown }) {
  useCms()
  if (loading && list.length === 0) return <ProductGridSkeleton count={12} />
  if (error && list.length === 0) return <p role="alert" className="py-12 text-center text-destructive">Unable to load products. Please try again.</p>
  if (list.length === 0) return <EmptyState onClear={onClear} />
  return (
    <>
      <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
