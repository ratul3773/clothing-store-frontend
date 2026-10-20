'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Heart } from 'lucide-react'
import { activeFlash, priceOf, totalStock, type Product } from '@/data/catalog'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/components/providers/StoreProvider'
import { bdt, cn } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import { productHref } from '@/lib/productHref'
import { discountPct } from '@/lib/storefront'

export default function ProductCard({ p, index = 0, now }: { p: Product; index?: number; now?: number }) {
  useCms()
  const { wishlist, toggleWish } = useStore()
  const liked = wishlist.includes(p.id)
  const flash = activeFlash(p, now ?? undefined)
  const price = priceOf(p, now ?? undefined)
  const was = flash ? p.offer ?? p.price : p.offer ? p.price : 0
  const badges = [...(flash ? [`FLASH −${flash.discountPct}%`] : []), ...p.badges, ...(totalStock(p) < 25 ? ['LOW STOCK'] : [])].slice(0, 2)
  const off = discountPct(p, price)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={productHref(p)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-muted">
          <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-110 group-hover:opacity-0" />
          <img src={p.images[1] ?? p.images[0]} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-100 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {badges.map((b) => <Badge key={b} className={b.startsWith('FLASH') ? 'bg-accent text-accent-foreground' : undefined}>{b}</Badge>)}
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-foreground/90 py-3 text-center backdrop-blur transition-transform duration-500 group-hover:translate-y-0">
            <span className="label-mono text-background">View · {p.sizes[0]}–{p.sizes[p.sizes.length - 1]}</span>
          </div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="label-mono text-muted-foreground">{p.sub} · {p.sku}</p>
            <h3 className="font-display mt-1.5  leading-none transition-colors group-hover:text-accent">{p.name}</h3>
          </div>
          <div className="text-right">
            <p className="font-semibold">{bdt(price)}</p>
            {was > 0 && <p className="text-xs text-muted-foreground line-through">{bdt(was)}</p>}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {p.colors.map((c) => <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-foreground/40" style={{ background: c.hex }} />)}
          {off > 0 && <span className="label-mono ml-auto text-accent">−{off}%</span>}
        </div>
      </Link>
      <button
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() => toggleWish(p.id)}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground backdrop-blur transition hover:scale-110"
      >
        <motion.span key={String(liked)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }}>
          <Heart size={16} className={cn(liked && 'fill-accent text-accent')} />
        </motion.span>
      </button>
    </motion.article>
  )
}
