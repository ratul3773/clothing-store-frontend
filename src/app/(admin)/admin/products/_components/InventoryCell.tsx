'use client'

import { setProductStock } from '@/data/cms'
import { cn } from '@/lib/utils'
import type { Product } from '@/data/catalog'
import { stockKey } from '../_utils/products.utils'

export default function InventoryCell({ product: p, lowStock }: { product: Product; lowStock: number }) {
  const set = (key: string, raw: string) => {
    const n = Math.max(0, Math.floor(Number(raw) || 0))
    setProductStock(p.id, { ...p.stock, [key]: n })
  }
  return (
    <div className="space-y-1">
      {p.colors.map((c) => (
        <div key={c.name} className="flex flex-wrap items-center gap-1.5">
          <span className="flex w-28 items-center gap-1.5 text-xs">
            <span className="size-3 rounded-full border border-border" style={{ background: c.hex }} />
            <span className="truncate">{c.name}</span>
          </span>
          {p.sizes.map((s) => {
            const k = stockKey(c.name, s)
            const v = p.stock[k] ?? 0
            return (
              <label key={s} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                {s}
                <input
                  type="number"
                  min={0}
                  value={v}
                  aria-label={`${c.name} ${s} stock`}
                  onChange={(e) => set(k, e.target.value)}
                  className={cn('h-7 w-14 rounded border border-border bg-card px-1.5 text-center text-xs text-foreground outline-none focus:border-primary', v === 0 ? 'border-red-300 bg-red-50' : v <= lowStock && 'border-amber-300 bg-amber-50')}
                />
              </label>
            )
          })}
        </div>
      ))}
    </div>
  )
}
