import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductSort from '@/app/(store)/shop/_components/ProductSort'
import { shopTitle } from '@/app/(store)/shop/_utils/shop.utils'

interface Props { count: number; q: string; cat: string; sub: string | null; sort: string; onSort: (v: string) => void; onToggleFilters: () => void }

export default function ShopHeader({ count, q, cat, sub, sort, onSort, onToggleFilters }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="label-mono text-muted-foreground">{count} pieces{q && <> for “{q}”</>}</p>
        <h1 className="font-display text-4xl">{shopTitle(cat, sub)}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="lg:hidden" onClick={onToggleFilters}><SlidersHorizontal size={15} /> Filters</Button>
        <ProductSort value={sort} onChange={onSort} />
      </div>
    </div>
  )
}
