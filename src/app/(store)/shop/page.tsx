import { Suspense } from 'react'
import ShopContent from '@/app/(store)/shop/_components/ShopContent'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  )
}
