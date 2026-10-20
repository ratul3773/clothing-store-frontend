'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/components/providers/StoreProvider'
import useProductPurchase from '@/app/(store)/p/[slug]/_hooks/useProductPurchase'
import ProductGallery from '@/app/(store)/p/[slug]/_components/ProductGallery'
import ProductInfo from '@/app/(store)/p/[slug]/_components/ProductInfo'
import CompleteTheLook from '@/app/(store)/p/[slug]/_components/CompleteTheLook'
import RecentlyViewed from '@/app/(store)/p/[slug]/_components/RecentlyViewed'
import { categoryLabel } from '@/lib/storefront'
import { useCms } from '@/lib/useCms'
import type { Product } from '@/data/catalog'

export default function ProductView({ p }: { p: Product }) {
  useCms()
  const { pushRecent } = useStore()
  const s = useProductPurchase(p)
  useEffect(() => { pushRecent(p.id) }, [p.id, pushRecent])

  return (
    <div>
      <p className="label-mono mb-6 text-muted-foreground"><Link href="/shop" className="hover:text-accent">Shop</Link> / <Link href={`/shop?cat=${encodeURIComponent(p.category)}`} className="hover:text-accent">{categoryLabel(p.category)}</Link> / {p.sku}</p>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ProductGallery p={p} color={s.color} onSelect={s.setCi} />
        <ProductInfo p={p} s={s} />
      </div>
      <CompleteTheLook p={p} />
      <RecentlyViewed currentId={p.id} />
    </div>
  )
}
