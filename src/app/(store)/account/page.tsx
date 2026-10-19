import { Suspense } from 'react'
import AccountView from '@/app/(store)/account/_components/AccountView'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AccountView />
    </Suspense>
  )
}
