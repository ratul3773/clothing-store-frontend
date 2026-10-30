'use client'

import { useMemo } from 'react'
import ProductCard from '@/components/common/ProductCard'
import Reveal from '@/components/common/Reveal'
import { useRecentlyViewed } from '../_hooks/useRecentlyViewed'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import { toStorefrontProducts } from '@/lib/public-product'
import ProductGridSkeleton from '@/components/common/ProductSkeleton/ProductGridSkeleton'

export default function RecentlyViewed({ currentId }: { currentId: string }) {
  const { ids } = useRecentlyViewed()

  const { data, isLoading } = useGetProductsQuery(
    { ids: ids, limit: ids.length },
    { skip: ids.length === 0 },
  )
  const list = useMemo(() => {
    const byId = new Map(toStorefrontProducts(data?.items ?? []).map((p) => [p.id, p]))
    return ids
      .filter((id) => id !== currentId)
      .map((id) => byId.get(id))                      // keeps most-recent-first order
      .filter((p): p is NonNullable<typeof p> => !!p) // drops deleted/unpublished
      .slice(0, 4)
  }, [ids, data, currentId])

  if (ids.length === 0) return null

  return (
    <Reveal className="mt-24">
      {list.length > 0  && <h2 className="font-display mb-6 text-xl sm:text-3xl">Recently <span className="text-accent">viewed</span></h2>}
      {isLoading
        ? <ProductGridSkeleton count={ids.length} />
        : <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      }
    </Reveal>
  )
}