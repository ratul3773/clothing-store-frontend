'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCms } from '@/lib/useCms'
import useProductFilters from '@/app/(store)/shop/_hooks/useProductFilters'
import ShopHeader from '@/app/(store)/shop/_components/ShopHeader'
import ProductFilters from '@/app/(store)/shop/_components/ProductFilters'
import ProductGrid from '@/app/(store)/shop/_components/ProductGrid'
import PaginationComponent from '@/components/common/Pagination'

export default function ShopContent() {
  useCms()
  const f = useProductFilters()
  const [open, setOpen] = useState(false)
  const filters = <ProductFilters f={f} />

  return (
    <>
      <ShopHeader count={f.paginationInfo?.total ?? 0} q={f.q} cat={f.cat} sub={f.sub} sort={f.sort} onSort={f.setSort} onToggleFilters={() => setOpen((o) => !o)} />
      <AnimatePresence>
        {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden"><div className="pt-8">{filters}</div></motion.div>}
      </AnimatePresence>
       <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-32">{filters}</div></aside>
         <div>
          <ProductGrid list={f.list} onClear={f.reset} loading={f.isLoading} error={f.isError ? f.error : undefined} />
          {f.paginationInfo && !f.isError && (
            <PaginationComponent
              paginationInfo={f.paginationInfo}
              onPageChange={f.setPage}
              onItemsPerPageChange={f.setLimit}
              itemsPerPageOptions={[6, 12, 24, 30]}
              itemsLabel="products"
            />
          )}
          </div>
      </div>
    </>
  )
}
