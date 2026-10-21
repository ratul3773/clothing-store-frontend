import { Badge } from '@/components/cms/ui'
import type { StockState } from '../_utils/products.utils'

export default function StockBadge({ state }: { state: StockState }) {
  if (state === 'out') return <Badge tone="red">Out</Badge>
  if (state === 'low') return <Badge tone="amber">Low</Badge>
  return null
}
