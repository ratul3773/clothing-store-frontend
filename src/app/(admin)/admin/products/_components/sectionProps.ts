import type { ProductDraft, ProductErrors } from '../_types/products.types'

export type SectionProps = { d: ProductDraft; patch: (p: Partial<ProductDraft>) => void; errors?: ProductErrors }
