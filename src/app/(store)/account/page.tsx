import { Suspense } from 'react'
import AccountPage from './_components/AccountPage';


export default function Page() {
  return (
      <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
        <AccountPage/>
      </Suspense>
  )
}
