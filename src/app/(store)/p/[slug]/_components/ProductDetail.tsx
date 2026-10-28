'use client'

import { Button } from '@/components/ui/button'
import ProductView from '@/app/(store)/p/[slug]/_components/ProductView'
import { useCms } from '@/lib/useCms'
import { useGetProductQuery } from '@/redux/apis/product.api'
import { toStorefrontProduct } from '@/lib/public-product'
import Loading from '@/components/common/Loading'

/** Resolves a product from an explicit slug (query-string route) or the dynamic route param. */
export default function ProductDetail({ slug }: { slug: string }) {
  useCms()
  const { data, isLoading, isError } = useGetProductQuery(
    { slug: slug},
    { skip: !slug },
  )
  if (isLoading) {
    return <div className="py-40"><Loading text="Loading product..." /></div>
  }

  if (isError || !data) {
    return (
      <div className="py-40 text-center">
        <p className="font-display text-3xl">Not found</p>
        <p className="mt-3 text-muted-foreground">We could not find that product.</p>
        <Button to="/shop" className="mt-6">Back to shop</Button>
      </div>
    )
  }

  return <ProductView key={data.slug} p={toStorefrontProduct(data)} />
}
