'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCms } from '@/lib/useCms'
import useProductFilters from '@/app/(store)/shop/_hooks/useProductFilters'
import ShopHeader from '@/app/(store)/shop/_components/ShopHeader'
import ProductFilters from '@/app/(store)/shop/_components/ProductFilters'
import ProductGrid from '@/app/(store)/shop/_components/ProductGrid'

export default function ShopContent() {
  useCms()
  const f = useProductFilters()
  const [open, setOpen] = useState(false)
  const filters = <ProductFilters f={f} />

  return (
    <div className="mx-auto max-w-[88rem] px-5 py-12 lg:px-10">
      <ShopHeader count={f.list.length} q={f.q} cat={f.cat} sub={f.sub} sort={f.sort} onSort={f.setSort} onToggleFilters={() => setOpen((o) => !o)} />
      <AnimatePresence>
        {open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden"><div className="pt-8">{filters}</div></motion.div>}
      </AnimatePresence>
      <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-32">{filters}</div></aside>
        <div><ProductGrid list={f.list} onClear={f.reset} /></div>
      </div>
    </div>
  )
}
