import { Suspense } from 'react'
import OrderView from '@/app/(store)/order/_components/OrderView'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <Suspense fallback={<Skeleton className="my-8 h-96" />}>
      <OrderView />
    </Suspense>
  )
}
