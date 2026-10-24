import { Suspense } from 'react'
import AccountPage from './_components/AccountPage';
import Loading from '../../../components/common/Loading';


export default function Page() {
  return (
      <Suspense fallback={<Loading />}>
        <AccountPage/>
      </Suspense>
  )
}
