'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Btn, Card, PageHeader } from '@/components/cms/ui'
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { settings } from '@/data/site'
import { useCms } from '@/lib/useCms'
import { useNavigate } from '@/lib/nav'
import { useStore } from '@/components/providers/StoreProvider'
import { totalStock, type Product } from '@/data/catalog'
import { listProducts, removeMany, setStatus, duplicateProduct } from '../_services/products.api'
import { stockState } from '../_utils/products.utils'
import ProductFilters, { defaultFilters, type Filters } from './ProductFilters'
import ProductsTable from './ProductsTable'
import InventoryTable from './InventoryTable'

export default function ProductList() {
  const ver = useCms()
  const { toast } = useStore()
  const go = useNavigate()
  const [tab, setTab] = useState<'products' | 'inventory'>('products')
  const [f, setF] = useState<Filters>(defaultFilters)
  const [selected, setSelected] = useState<string[]>([])
  const [confirm, setConfirm] = useState<string[] | null>(null)
  const low = settings.orders.lowStock

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    const list = listProducts().filter((p) => {
      if (q && !`${p.name} ${p.sku} ${p.slug}`.toLowerCase().includes(q)) return false
      if (f.cat && p.category !== f.cat) return false
      if (f.sub && p.sub !== f.sub) return false
      if (f.status !== 'all' && p.status !== f.status) return false
      const s = stockState(p, low)
      if (f.stock === 'low' && s !== 'low') return false
      if (f.stock === 'out' && s !== 'out') return false
      return true
    })
    return tab === 'inventory' ? [...list].sort((a, b) => totalStock(a) - totalStock(b)) : list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f, low, tab, tab === 'inventory' ? 0 : ver])

  const resetKey = JSON.stringify(f) + tab
  const bulk = (fn: () => void, msg: string) => {
    fn()
    toast(msg)
    setSelected([])
  }
  const del = (ids: string[]) => {
    removeMany(ids)
    setSelected((s) => s.filter((x) => !ids.includes(x)))
    toast(ids.length === 1 ? 'Product deleted' : `${ids.length} products deleted`)
  }
  const dup = (p: Product) => {
    const c = duplicateProduct(p)
    toast('Product duplicated as draft')
    go(`/admin/products?id=${c.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${listProducts().length} products in your catalog`}
        crumbs={['Catalog', 'Products']}
        actions={<Btn variant="primary" onClick={() => go('/admin/products?new=1')}><Plus className="size-4" />Add product</Btn>}
      />
      <Card>
        <div className="flex gap-1 border-b border-border px-3 pt-2">
          {(['products', 'inventory'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium capitalize ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>
          ))}
        </div>
        <ProductFilters value={f} onChange={setF} />
        {tab === 'products' && selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-primary/5 px-3 py-2 text-[13px]">
            <span className="font-medium">{selected.length} selected</span>
            <Btn size="sm" onClick={() => bulk(() => setStatus(selected, 'active'), 'Published')}>Publish</Btn>
            <Btn size="sm" onClick={() => bulk(() => setStatus(selected, 'draft'), 'Moved to draft')}>Set to draft</Btn>
            <Btn size="sm" variant="dangerOutline" onClick={() => setConfirm(selected)}>Delete</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Btn>
          </div>
        )}
        {tab === 'products' ? (
          <ProductsTable rows={rows} resetKey={resetKey} selected={selected} onSelect={setSelected} lowStock={low} onEdit={(p) => go(`/admin/products?id=${p.id}`)} onDuplicate={dup} onDelete={(p) => setConfirm([p.id])} />
        ) : (
          <InventoryTable rows={rows} resetKey={resetKey} lowStock={low} />
        )}
      </Card>
      <AlertDialogText
        mode="normal"
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={`Delete ${confirm?.length ?? 0} product${confirm?.length === 1 ? '' : 's'}?`}
        description="This permanently removes the product(s) from the catalog, flash sales and complete-the-look lists."
        actionType="delete"
        onConfirm={() => confirm && del(confirm)}
      />
    </div>
  )
}
