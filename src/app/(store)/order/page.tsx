import { Suspense } from 'react'
import OrderView from '@/app/(store)/order/_components/OrderView'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <OrderView />
    </Suspense>
  )
}
