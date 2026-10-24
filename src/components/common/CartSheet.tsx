'use client'

import { useNavigate } from '@/lib/nav'
import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, Trash2, Truck } from 'lucide-react'
import { Sheet } from '@/components/ui/sheeet'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt } from '@/lib/utils'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'

export default function CartSheet() {
  useCms()
  const { cartOpen, setCartOpen, lines, lineInfo, setQty, remove, subtotal, count } = useStore()
  const navigate = useNavigate()
  const left = Math.max(0, settings.delivery.freeAbove - subtotal)

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen} side="right" title={`Your bag (${count})`} description="Review items before checkout">
      <div className="border-b border-border px-5 py-4">
        <p className="mb-2 flex items-center gap-2 text-sm">
          <Truck size={16} className="text-accent" />
          {left > 0 ? <>Add <b>{bdt(left)}</b> more for free delivery</> : <b>Free delivery unlocked</b>}
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/15">
          <motion.div className="h-full bg-accent" animate={{ width: `${Math.min(100, (subtotal / settings.delivery.freeAbove) * 100)}%` }} transition={{ type: 'spring', damping: 24 }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5">
        {lines.length === 0 && (
          <div className="grid h-full place-items-center py-20 text-center">
            <div>
              <p className="font-display text-6xl text-foreground/20">Empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Nothing here yet. Guests can check out without an account.</p>
              <Button className="mt-6" onClick={() => { setCartOpen(false); navigate('/shop') }}>Start shopping</Button>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {lines.map((l) => {
            const i = lineInfo(l)
            return (
              <motion.div key={l.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40, height: 0 }} className="flex gap-4 border-b border-border py-4">
                <img src={i.image} alt={i.name} className="h-28 w-[5.5rem] shrink-0 rounded-[2px] bg-muted object-cover" />
                <div className="flex flex-1 flex-col">
                  <p className="font-semibold leading-tight">{i.name}</p>
                  <p className="label-mono mt-1 text-muted-foreground">{i.sub}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-foreground/40">
                      <button aria-label="Decrease" className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-foreground hover:text-background" onClick={() => setQty(l.key, -1)}><Minus size={13} /></button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button aria-label="Increase" className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-foreground hover:text-background" onClick={() => setQty(l.key, 1)}><Plus size={13} /></button>
                    </div>
                    <span className="font-semibold">{bdt(i.unit * l.qty)}</span>
                  </div>
                </div>
                <button aria-label="Remove" onClick={() => remove(l.key)} className="self-start text-muted-foreground transition hover:text-accent"><Trash2 size={16} /></button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      {lines.length > 0 && (
        <div className="space-y-3 border-t border-border p-5">
          <div className="flex justify-between text-sm"><span>Subtotal</span><b>{bdt(subtotal)}</b></div>
          <p className="text-xs text-muted-foreground">Delivery and coupons are calculated at checkout.</p>
          <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={() => { setCartOpen(false); navigate('/cart') }}>View cart</Button>
          <Button variant="accent" className="w-full" onClick={() => { setCartOpen(false); navigate('/checkout') }}>Checkout</Button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
