import ProductDetail from '@/app/(store)/p/[slug]/_components/ProductDetail'
import { getProducts } from '@/app/(store)/p/[slug]/_services/product.api'


export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }))
}

export default function Page() {
  return <ProductDetail />
}
