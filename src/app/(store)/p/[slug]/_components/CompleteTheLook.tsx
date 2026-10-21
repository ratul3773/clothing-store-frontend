'use client'

import { Button } from '@/components/ui/button'
import ProductCard from '@/components/common/ProductCard'
import Reveal from '@/components/common/Reveal'
import { useStore } from '@/components/providers/StoreProvider'
import { priceOf, type Product } from '@/data/catalog'
import { bdt } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import { getProductById } from '@/app/(store)/p/[slug]/_services/product.api'

export default function CompleteTheLook({ p }: { p: Product }) {
  const { addItem, stockOf, toast } = useStore()
  useCms()
  const looks = p.look.map(getProductById).filter((l): l is Product => !!l)
  if (looks.length === 0) return null
  const addLook = () => {
    looks.forEach((l) => {
      const c = l.colors[0]
      const s = l.sizes.find((z) => stockOf(l, c.name, z) > 0)
      if (s) addItem(l, c.name, s, 1, false)
    })
    toast(`${looks.length} items added to bag`)
  }
  return (
    <Reveal className="mt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display sm:text-2xl">Complete the <span className="text-accent">look</span></h2>
        <Button variant="outline" onClick={addLook}>Add all {looks.length} to bag · {bdt(looks.reduce((a, l) => a + priceOf(l), 0))}</Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{looks.map((l, i) => <ProductCard key={l.id} p={l} index={i} />)}</div>
    </Reveal>
  )
}
