'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProductView from '@/app/(store)/p/[slug]/_components/ProductView'
import { getProductBySlug } from '@/app/(store)/p/[slug]/_services/product.api'
import { useCms } from '@/lib/useCms'

/** Resolves a product from an explicit slug (query-string route) or the dynamic route param. */
export default function ProductDetail({ slug }: { slug?: string }) {
  useCms()
  const param = useParams<{ slug?: string }>().slug
  const p = getProductBySlug(slug ?? param)
  if (!p || p.status !== 'active') {
    return (
      <div className="py-40 text-center">
        <p className="font-display text-3xl">{p ? 'Not available' : 'Not found'}</p>
        <p className="mt-3 text-muted-foreground">{p ? 'This piece is not on sale right now.' : 'We could not find that product.'}</p>
        <Button to="/shop" className="mt-6">Back to shop</Button>
      </div>
    )
  }
  return <ProductView key={p.slug} p={p} />
}
