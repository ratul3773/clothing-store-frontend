import { Suspense } from 'react'
import ProductsView from './_components/ProductsView'

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsView />
    </Suspense>
  )
}
