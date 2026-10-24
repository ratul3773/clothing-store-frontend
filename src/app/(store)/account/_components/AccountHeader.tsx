'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import { useLogout } from '@/hooks/useLogout'
import AlertText from '@/components/common/Alert'

export default function AccountHeader({ name }: { name: string }) {
  const { handleSignOut,isSigningOut,error } = useLogout()
  return (
    <>
    {error && <AlertText
        title="Error"
        description={error}
      />}
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label-mono text-muted-foreground">Member · phone verified ✓</p>
        <p className="text-xl font-display">Hi, {name.split(' ')[0]}</p>
      </div>
      
      <Button 
      variant="outline" 
      onClick={handleSignOut} 
      disabled={isSigningOut}>
        <LogOut size={14} /> 
        {isSigningOut ? 'Signing out...' : 'Sign out'}
        </Button>
    </div>
    </>
  )
}
