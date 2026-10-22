import { Suspense } from 'react'
import CouponsView from './_components/CouponsView'

export default function Page() {
  return (
    <Suspense>
      <CouponsView />
    </Suspense>
  )
}
