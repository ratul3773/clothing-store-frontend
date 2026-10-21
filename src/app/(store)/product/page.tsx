import { Suspense } from 'react'
import ProductBySlug from '@/app/(store)/product/_components/ProductBySlug'

/** Runtime-created (CMS) products have no prerendered page, so they resolve from ?slug=. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProductBySlug />
    </Suspense>
  )
}
