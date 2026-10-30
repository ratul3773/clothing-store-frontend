'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import { useCms } from '@/lib/useCms'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import { toStorefrontProduct } from '@/lib/public-product'
import ProductGridSkeleton from '@/components/common/ProductSkeleton/ProductGridSkeleton'
import ProductCarousel from '@/components/common/ProductCarousel'

export default function BestSellers() {
  useCms()
  const { data: list, isLoading } = useGetProductsQuery({
    limit:10,
    badge: "BEST_SELLER",
  })
  const items = list?.items?.map((p) => toStorefrontProduct(p)) ?? []
  return (
    <section className="mt-24">
      <Reveal className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-2xl sm:text-4xl">Best <span className="text-accent">sellers</span></h2>
        <Link href="/shop?badge=BEST_SELLER" className="label-mono group items-center gap-2 flex">View all <ArrowUpRight size={14} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
      </Reveal>
      {items?.length === 0 && !isLoading && <p className="text-center text-muted-foreground">No best sellers found.</p>}
      {isLoading && <ProductGridSkeleton count={4} />}
      <ProductCarousel items={items} />
    </section>
  )
}
