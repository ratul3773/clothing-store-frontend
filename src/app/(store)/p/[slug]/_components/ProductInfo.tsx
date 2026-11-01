'use client'

import { useState } from 'react'
import ProductSummary from '@/app/(store)/p/[slug]/_components/ProductSummary'
import ColorPicker from '@/app/(store)/p/[slug]/_components/ColorPicker'
import SizePicker from '@/app/(store)/p/[slug]/_components/SizePicker'
import PurchaseActions from '@/app/(store)/p/[slug]/_components/PurchaseActions'
import ProductTabs from '@/app/(store)/p/[slug]/_components/ProductTabs'
import SizeAssistant from '@/app/(store)/p/[slug]/_components/SizeAssistant'
import type useProductPurchase from '@/app/(store)/p/[slug]/_hooks/useProductPurchase'
import type { Product } from '@/data/catalog'
import { Button } from '@/components/ui/button'

export default function ProductInfo({ p, s }: { p: Product; s: ReturnType<typeof useProductPurchase> }) {
  const [assist, setAssist] = useState(false)
  return (
    <div className="lg:sticky lg:top-32 lg:self-start">
      <ProductSummary p={p} />
      <ColorPicker colors={p.colors} index={s.ci} onSelect={s.selectColor} />
      <SizePicker sizes={p.sizes} selected={s.size} avail={s.avail} shake={s.shake} stockFor={(z) => s.stockOf(p, s.color.name, z)} onSelect={s.selectSize} onAssist={() => setAssist(true)} />
      <PurchaseActions qty={s.qty} liked={s.liked} onDec={s.decQty} onInc={s.incQty} onAdd={() => void s.add(false)} onWish={s.toggleWish} canAdd={s.canAdd} canIncrease={s.canIncrease} canDecrease={s.canDecrease} adding={s.adding} isInCart={s.isInCart} />
      {s.error && <div role="alert" className="mt-3 space-y-2 text-sm"><p className="text-destructive">{s.error}</p><Button variant="outline" size="sm" onClick={() => void s.reload()}>Reload bag</Button></div>}
      <ProductTabs p={p} size={s.size} />
      <SizeAssistant p={p} open={assist} onOpenChange={setAssist} onPick={s.setSize} />
    </div>
  )
}
