'use client'

import { useCms } from '@/lib/useCms'
import { useSearchParams } from '@/lib/nav'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import { Empty, Btn } from '@/components/cms/ui'
import { findProduct } from '../_services/products.api'

export default function ProductsView() {
  useCms()
  const [sp, setSp] = useSearchParams()
  const id = sp.get('id')
  if (sp.get('new') === '1') return <ProductForm key="new" />
  if (id) {
    const p = findProduct(id)
    if (!p) return <Empty title="Product not found" description="It may have been deleted." action={<Btn onClick={() => setSp({})}>Back to products</Btn>} />
    return <ProductForm key={id} productId={id} />
  }
  return <ProductList />
}
