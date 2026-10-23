import AccountView from '@/app/(store)/account/_components/AccountView'
import { getServerSession } from '@/lib/auth-session'
import { redirect } from 'next/navigation';


export default async function AccountPage() {
  const session = await getServerSession();
  if(!session.isAuthenticated){
    redirect('/login')
  }
  return (
        <AccountView user={session} />
  )
}