'use client'

import ProductCard from '@/components/common/ProductCard'
import Reveal from '@/components/common/Reveal'
import { useCms } from '@/lib/useCms'
import type { Product } from '@/data/catalog'
import { useStore } from '@/components/providers/StoreProvider'
import { getProductById } from '@/app/(store)/p/[slug]/_services/product.api'

export default function RecentlyViewed({ currentId }: { currentId: string }) {
  const { recent } = useStore()
  useCms()
  const items = recent.filter((r) => r !== currentId).map(getProductById).filter((p): p is Product => !!p)
  if (items.length === 0) return null
  return (
    <Reveal className="mt-24">
      <h2 className="font-display mb-6 text-4xl">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{items.slice(0, 4).map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div>
    </Reveal>
  )
}
