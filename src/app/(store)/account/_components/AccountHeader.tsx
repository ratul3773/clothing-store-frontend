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
        <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)]">Hi, {name.split(' ')[0]}</h1>
      </div>
      <Button variant="outline" onClick={() => { setUser(null); toast('Signed out') }}><LogOut size={14} /> Sign out</Button>
    </div>
  )
}
