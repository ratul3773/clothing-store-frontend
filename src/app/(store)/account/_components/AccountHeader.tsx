'use client'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'

export default function AccountHeader({ name }: { name: string }) {
  const { setUser, toast } = useStore()
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label-mono text-muted-foreground">Member · phone verified ✓</p>
        <p className="text-xl font-display">Hi, {name.split(' ')[0]}</p>
      </div>
      <Button variant="outline" onClick={() => { setUser(null); toast('Signed out') }}><LogOut size={14} /> Sign out</Button>
    </div>
  )
}
