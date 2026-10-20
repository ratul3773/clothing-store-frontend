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

export default function ProductInfo({ p, s }: { p: Product; s: ReturnType<typeof useProductPurchase> }) {
  const [assist, setAssist] = useState(false)
  return (
    <div className="lg:sticky lg:top-32 lg:self-start">
      <ProductSummary p={p} />
      <ColorPicker colors={p.colors} index={s.ci} onSelect={s.selectColor} />
      <SizePicker sizes={p.sizes} selected={s.size} avail={s.avail} shake={s.shake} stockFor={(z) => s.stockOf(p, s.color.name, z)} onSelect={s.selectSize} onAssist={() => setAssist(true)} />
      <PurchaseActions qty={s.qty} liked={s.liked} onDec={s.decQty} onInc={s.incQty} onAdd={() => s.add(false)} onBuy={() => s.add(true)} onWish={s.toggleWish} />
      <ProductTabs p={p} size={s.size} />
      <SizeAssistant p={p} open={assist} onOpenChange={setAssist} onPick={s.setSize} />
    </div>
  )
}
