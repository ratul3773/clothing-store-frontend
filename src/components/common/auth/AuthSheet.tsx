'use client'

import { Sheet } from '@/components/ui/sheeet'
import { useStore } from '@/components/providers/StoreProvider'
import AuthForm from './auth-form'

export default function AuthSheet() {
  const { authOpen, setAuthOpen } = useStore()


  function handleOpenChange(open: boolean) {
    setAuthOpen(open)
  }

  return (
    <Sheet
      open={authOpen}
      onOpenChange={handleOpenChange}
      title="Member access"
      description="Sign in to see orders, wishlist and saved addresses."
    >
      <AuthForm />
    </Sheet>
  )
}

