'use client'

import { Button } from '@/components/ui/button'
import ProductCard from '@/components/common/ProductCard'
import Reveal from '@/components/common/Reveal'
import type { Product } from '@/data/catalog'
import { useCms } from '@/lib/useCms'
import { getProductById } from '@/app/(store)/p/[slug]/_services/product.api'

export default function CompleteTheLook({ p }: { p: Product }) {
  useCms()
  const looks = p.look.map(getProductById).filter((l): l is Product => !!l)
  if (looks.length === 0) return null
  return (
    <Reveal className="mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display sm:text-2xl">Complete the <span className="text-accent">look</span></h2>
        <Button variant="outline" disabled title="Live look variants are not available yet">Add look coming soon</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{looks.map((l, i) => <ProductCard key={l.id} p={l} index={i} />)}</div>
    </Reveal>
  )
}
