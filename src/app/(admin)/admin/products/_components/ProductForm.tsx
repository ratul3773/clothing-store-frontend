'use client'

import { useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import { Btn, PageHeader } from '@/components/cms/ui'
import { useCms } from '@/lib/useCms'
import { useNavigate } from '@/lib/nav'
import { useStore } from '@/components/providers/StoreProvider'
import { slugify } from '@/data/cms'
import { findProduct, draftFromProduct, emptyDraft, listProducts, persistProduct } from '../_services/products.api'
import { validateProduct } from '../_schemas/product.schema'
import type { ProductDraft, ProductErrors } from '../_types/products.types'
import BasicSection from './BasicSection'
import PricingSection from './PricingSection'
import DetailsSection from './DetailsSection'
import ImagesSection from './ImagesSection'
import VariantsSection from './VariantsSection'
import StockMatrix from './StockMatrix'
import LookSection from './LookSection'
import ProductPreview from './ProductPreview'

export default function ProductForm({ productId }: { productId?: string }) {
  useCms()
  const { toast } = useStore()
  const go = useNavigate()
  const [d, setD] = useState<ProductDraft>(() => {
    const p = productId ? findProduct(productId) : undefined
    return p ? draftFromProduct(p) : emptyDraft()
  })
  const [tried, setTried] = useState(false)

  const patch = (p: Partial<ProductDraft>) =>
    setD((prev) => {
      const next = { ...prev, ...p }
      if ('name' in p && !prev.slugTouched && !('slug' in p)) next.slug = slugify(next.name)
      return next
    })

  const errors: ProductErrors = tried ? validateProduct(d, listProducts()) : {}
  const others = useMemo(() => listProducts().filter((p) => p.id !== d.id), [d.id])

  const save = () => {
    setTried(true)
    if (Object.keys(validateProduct(d, listProducts())).length) {
      toast('Please fix the highlighted fields')
      return
    }
    persistProduct(d)
    toast(d.isNew ? 'Product created' : 'Product saved')
    go('/admin/products')
  }

  return (
    <div>
      <PageHeader
        title={d.isNew ? 'New product' : d.name || 'Edit product'}
        crumbs={['Catalog', 'Products', d.isNew ? 'New' : 'Edit']}
        actions={
          <>
            <Btn onClick={() => go('/admin/products')}>Cancel</Btn>
            <Btn variant="primary" onClick={save}><Save className="size-4" />Save product</Btn>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <BasicSection d={d} errors={errors} patch={patch} />
          <PricingSection d={d} errors={errors} patch={patch} />
          <DetailsSection d={d} patch={patch} />
          <ImagesSection d={d} error={errors.images} patch={patch} />
          <VariantsSection d={d} errors={errors} patch={patch} />
          <StockMatrix d={d} patch={patch} />
          <LookSection d={d} others={others} patch={patch} />
          <div className="flex justify-end gap-2 pb-6">
            <Btn onClick={() => go('/admin/products')}>Cancel</Btn>
            <Btn variant="primary" onClick={save}><Save className="size-4" />Save product</Btn>
          </div>
        </div>
        <div className="xl:sticky xl:top-4 xl:self-start">
          <ProductPreview d={d} />
        </div>
      </div>
    </div>
  )
}
