'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import ProductCarousel from '@/components/common/ProductCarousel'
import { useGetProductsQuery } from '@/redux/apis/product.api'
import { toStorefrontProduct } from '@/lib/public-product'
import ProductGridSkeleton from '@/components/common/ProductSkeleton/ProductGridSkeleton'

export default function NewArrivals() {
    const { data: list, isLoading } = useGetProductsQuery({
      limit:10,
      badge: "NEW",
    })
    const items = list?.items?.map((p) => toStorefrontProduct(p)) ?? []
  return (
    <section className="mt-24">
      <Reveal className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label-mono mb-3 flex items-center gap-3"><span className="h-px w-10 bg-accent" /> Just landed · swipe to explore</p>
          <h2 className="font-display text-2xl sm:text-4xl">New <span className="text-accent">arrivals</span></h2>
        </div>
        <Link href="/shop" className="label-mono group hidden items-center gap-2 sm:flex">View all <ArrowUpRight size={14} className="transition group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
      </Reveal>
      {items?.length === 0 && !isLoading && <p className="text-center text-muted-foreground">No new arrivals found.</p>}
      {isLoading && <ProductGridSkeleton count={4} />}
      <ProductCarousel items={items} />
    </section>
  )
}