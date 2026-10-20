'use client'

import { Pagination } from '@/components/ui/pagination'
import usePagination from '@/lib/usePagination'
import ProductCard from '@/components/common/ProductCard'
import { useStore } from '@/components/providers/StoreProvider'
import { useCms } from '@/lib/useCms'
import { visibleProducts } from '@/lib/storefront'

export default function WishlistTab() {
  useCms()
  const { wishlist } = useStore()
  const items = visibleProducts(wishlist)
  const pg = usePagination(items, 4)
  return items.length
    ? <><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{pg.pageItems.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div><Pagination page={pg.page} pageCount={pg.pageCount} onChange={pg.setPage} id="pg-wish" /></>
    : <p className="text-muted-foreground">Nothing saved yet.</p>
}
