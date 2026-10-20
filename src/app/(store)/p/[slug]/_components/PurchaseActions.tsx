'use client'

import { Heart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props { qty: number; liked: boolean; onDec: () => void; onInc: () => void; onAdd: () => void; onBuy: () => void; onWish: () => void }

export default function PurchaseActions({ qty, liked, onDec, onInc, onAdd, onBuy, onWish }: Props) {
  return (
    <>
      <div className="mt-4 flex gap-3">
        <div className="flex items-center rounded-[3px] border border-foreground/40">
          <button aria-label="Less" className="grid w-11 place-items-center transition hover:bg-foreground hover:text-background" onClick={onDec}><Minus size={15} /></button>
          <span className="w-8 text-center font-semibold">{qty}</span>
          <button aria-label="More" className="grid w-11 place-items-center transition hover:bg-foreground hover:text-background" onClick={onInc}><Plus size={15} /></button>
        </div>
        <Button size="lg" onClick={onAdd}>Add to bag</Button>
      <Button size="lg" variant="accent" onClick={onBuy}>Buy now — guest checkout</Button>
        <Button aria-label="Wishlist" variant="outline" size="icon" onClick={onWish} className="grid h-10 w-10 place-items-center rounded-[3px] border border-foreground/40 transition hover:bg-foreground hover:text-background"><Heart size={20} className={cn(liked && 'fill-accent text-accent')} /></Button>
      </div>
    </>
  )
}
