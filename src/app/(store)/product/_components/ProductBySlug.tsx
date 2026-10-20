'use client'

import { useSearchParams } from '@/lib/nav'
import ProductDetail from '@/app/(store)/p/[slug]/_components/ProductDetail'

export default function ProductBySlug() {
  const [sp] = useSearchParams()
  return <ProductDetail slug={sp.get('slug') ?? ''} />
}
