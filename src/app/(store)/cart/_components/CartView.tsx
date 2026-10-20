'use client'

import { Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/providers/StoreProvider'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'
import { bdt } from '@/lib/utils'

export default function CartView() {
  useCms()
  const { lines, lineInfo, setQty, remove, subtotal, count, coupon, couponDiscount } = useStore()
  const remaining = Math.max(0, settings.delivery.freeAbove - subtotal)
  const discount = couponDiscount(subtotal)

  return (
    <>
      <p className="label-mono text-muted-foreground">Your selections</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <h1 className="font-display text-lg sm:text-2xl font-medium leading-none">Your cart</h1>
        {lines.length > 0 && <p className="label-mono text-muted-foreground">{count} {count === 1 ? 'item' : 'items'}</p>}
      </div>

      {lines.length === 0 ? (
        <div className="py-24 text-center">
          <ShoppingBag size={30} className="mx-auto text-muted-foreground" />
          <h2 className="mt-5 font-display sm:text-lg">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">Find something you love and it will show up here.</p>
          <Button to="/shop" variant="accent" className="mt-7">Explore the shop</Button>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
          <section aria-label="Cart items" className="divide-y divide-border">
            {lines.map((line) => {
              const item = lineInfo(line)
              return (
                <article key={line.key} className="flex gap-4 py-5 first:pt-0 sm:gap-6">
                  <img src={item.image} alt={item.name} className="h-36 w-28 shrink-0 rounded-[3px] bg-muted object-cover sm:h-44 sm:w-36" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-semibold">{item.name}</h2>
                        <p className="label-mono mt-1 text-muted-foreground">{item.sub}</p>
                      </div>
                      <button aria-label={`Remove ${item.name}`} onClick={() => remove(line.key)} className="rounded-full p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-accent">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                      <div className="flex items-center rounded-full border border-foreground/30">
                        <button aria-label={`Decrease quantity of ${item.name}`} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-foreground hover:text-background" onClick={() => setQty(line.key, -1)}><Minus size={13} /></button>
                        <span className="w-8 text-center text-sm" aria-label="Quantity">{line.qty}</span>
                        <button aria-label={`Increase quantity of ${item.name}`} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-foreground hover:text-background" onClick={() => setQty(line.key, 1)}><Plus size={13} /></button>
                      </div>
                      <p className="font-semibold">{bdt(item.unit * line.qty)}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>

          <aside className="space-y-5 border border-border p-5 sm:p-6">
            <div>
              <p className="label-mono mb-3 flex items-center gap-2"><Truck size={15} /> Delivery</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {remaining > 0 ? `Add ${bdt(remaining)} more to unlock free delivery.` : 'Free delivery unlocked.'}
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/15">
                <div className="h-full bg-accent transition-[width]" style={{ width: `${Math.min(100, (subtotal / settings.delivery.freeAbove) * 100)}%` }} />
              </div>
            </div>
            <div className="space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{bdt(subtotal)}</span></div>
              {coupon && discount > 0 && <div className="flex justify-between text-accent"><span>Coupon ({coupon})</span><span>−{bdt(discount)}</span></div>}
              <div className="flex justify-between border-t border-border pt-3 font-semibold"><span>Estimated total</span><span>{bdt(subtotal - discount)}</span></div>
              <p className="text-xs leading-relaxed text-muted-foreground">Delivery is calculated at checkout. You can check out as a guest or sign in.</p>
            </div>
            <Button to="/checkout" variant="accent" size="lg" className="w-full">Continue to checkout</Button>
            <Button to="/shop" variant="outline" className="w-full">Continue shopping</Button>
          </aside>
        </div>
      )}
    </>
  )
}
