'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Check1, Range } from '@/components/ui/controls'
import { bdt, cn } from '@/lib/utils'
import { useCms } from '@/lib/useCms'
import type useProductFilters from '@/app/(store)/shop/_hooks/useProductFilters'
import { Skeleton } from '@/components/ui/skeleton'

type Filters = ReturnType<typeof useProductFilters>

export default function ProductFilters({ f }: { f: Filters }) {
  useCms()
  const { cat, sub, badge, price,isCategoriesLoading } = f
  const categories = [{ cat: 'all', label: 'All' }, ...f.categories]
  return (
    <div className="space-y-8">
      <div>
        <p className="label-mono mb-3 text-muted-foreground">Category</p>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {isCategoriesLoading ? (
            <>
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-8 w-full rounded-[3px]" />
              ))}
            </>
          ) : (
            <>
              {categories.map((c) => (
                <Button 
                key={c.cat}
                variant="outline"
                size="sm"
                type="button"
                aria-pressed={cat === c.cat}
                className={cn('justify-start', cat === c.cat && 'border-foreground bg-foreground text-background')}
                onClick={() => f.setCat(c.cat)} >
                  {c.label}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
      {cat !== 'all' && (
        <div>
          <p className="label-mono mb-3 text-muted-foreground">Type</p>
          <div className="flex flex-wrap gap-2">
            {f.subcategories.map((s) => (
              <Button key={s.id} type="button" variant="outline" size="sm" shape="pill" aria-pressed={sub === s.slug} onClick={() => f.toggleSub(s.slug)} className={cn('label-mono', sub === s.slug ? 'border-accent bg-accent text-accent-foreground' : 'border-foreground/30 hover:border-foreground')}>{s.name}</Button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="label-mono mb-3 text-muted-foreground">Badge</p>
        <div className="flex flex-wrap gap-2">
          {f.badgeOptions.map((option) => (
            <Button key={option.value} type="button" variant="outline" size="sm" aria-pressed={badge === option.value} onClick={() => f.setBadge(badge === option.value ? '' : option.value)} className={cn('hover:-translate-y-0.5', badge === option.value ? 'border-accent bg-accent text-accent-foreground' : 'border-foreground/30 hover:border-foreground')}>{option.label}</Button>
          ))}
        </div>
      </div>
      <div>
        <p className="label-mono mb-1 text-muted-foreground">Price</p>
        <p className="mb-3 text-sm">{bdt(price[0])} – {bdt(price[1])}</p>
        <Range value={price} onChange={f.setPrice} min={price[0]} max={price[1]} />
      </div>
      <div>
        <Check1 checked={f.offersOnly} onChange={f.setOffersOnly} label="On offer" />
        <Check1 checked={f.inStock} onChange={f.setInStock} label="In stock only" />
      </div>
      <Button variant="ghost" size="sm" onClick={f.reset}><X size={14} /> Reset</Button>
    </div>
  )
}
