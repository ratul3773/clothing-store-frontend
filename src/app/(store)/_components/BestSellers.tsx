'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '@/components/common/Reveal'
import ProductCard from '@/components/common/ProductCard'
import { useCms } from '@/lib/useCms'
import useNow from '@/lib/useNow'
import { getBestSellers } from '@/app/(store)/_services/home.api'

export default function BestSellers() {
  useCms()
  const now = useNow(30_000)
  const list = getBestSellers()
  if (list.length === 0) return null
  return (
    <section className="mt-28">
      <Reveal className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-4xl">Best <span className="text-accent">sellers</span></h2>
        <Link href="/shop" className="label-mono group hidden items-center gap-2 sm:flex">View all <ArrowUpRight size={14} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {list.map((p, i) => <ProductCard key={p.id} p={p} index={i} now={now ?? undefined} />)}
      </div>
    </section>
  )
}
