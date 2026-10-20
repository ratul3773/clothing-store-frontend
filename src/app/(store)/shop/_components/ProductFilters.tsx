'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Check1, Range } from '@/components/ui/controls'
import { bdt, cn } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import { getCategories, getSizes, getSubcategories } from '@/app/(store)/shop/_services/product.api'
import type useProductFilters from '@/app/(store)/shop/_hooks/useProductFilters'

type Filters = ReturnType<typeof useProductFilters>

export default function ProductFilters({ f }: { f: Filters }) {
  useCms()
  const { cat, sub, sizes, price, bounds } = f
  const categories = [{ cat: 'all', label: 'All' }, ...getCategories()]
  return (
    <div className="space-y-8">
      <div>
        <p className="label-mono mb-3 text-muted-foreground">Category</p>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {categories.map((c) => (
            <button key={c.cat} onClick={() => f.setCat(c.cat)} className={cn('font-display relative overflow-hidden rounded-[3px] border px-3 py-2 text-left transition', cat === c.cat ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground')}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {cat !== 'all' && (
        <div>
          <p className="label-mono mb-3 text-muted-foreground">Type</p>
          <div className="flex flex-wrap gap-2">
            {getSubcategories(cat).map((s) => (
              <button key={s} onClick={() => f.toggleSub(s)} className={cn('label-mono rounded-full border px-3.5 py-2 transition', sub === s ? 'border-accent bg-accent text-accent-foreground' : 'border-foreground/30 hover:border-foreground')}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="label-mono mb-3 text-muted-foreground">Size</p>
        <div className="flex flex-wrap gap-2">
          {getSizes().map((s) => (
            <button key={s} onClick={() => f.toggleSize(s)} className={cn('grid h-10 min-w-10 place-items-center rounded-[3px] border px-2 text-sm transition hover:-translate-y-0.5', sizes.includes(s) ? 'border-accent bg-accent text-accent-foreground' : 'border-foreground/30 hover:border-foreground')}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="label-mono mb-1 text-muted-foreground">Price</p>
        <p className="mb-3 text-sm">{bdt(price[0])} – {bdt(price[1])}</p>
        <Range value={price} onChange={f.setPrice} min={bounds[0]} max={bounds[1]} />
      </div>
      <div>
        <Check1 checked={f.offersOnly} onChange={f.setOffersOnly} label="On offer" />
        <Check1 checked={f.inStock} onChange={f.setInStock} label="In stock only" />
      </div>
      <Button variant="ghost" size="sm" onClick={f.reset}><X size={14} /> Reset</Button>
    </div>
  )
}
