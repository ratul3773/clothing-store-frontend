'use client'

import { useState } from 'react'
import * as T from '@radix-ui/react-tabs'
import { Ruler } from 'lucide-react'
import { TabsList, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import ProductReviews from '@/app/(store)/p/[slug]/_components/ProductReviews'
import { useStore } from '@/components/providers/StoreProvider'
import { sizeChart, type Product } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { reviewCount } from '@/lib/storefront'
import { useCms } from '@/lib/useCms'
import { deliveryInfo } from '@/app/(store)/p/[slug]/_constants/product.constants'

export default function ProductTabs({ p, size }: { p: Product; size: string | null }) {
  useCms()
  const [tab, setTab] = useState('details')
  const { reviews } = useStore()
  const count = reviewCount(p, reviews)
  const chart = sizeChart[p.category] ?? []
  const waist = p.sizes.every((z) => /^\d+(\.\d+)?$/.test(z))
  return (
    <T.Root value={tab} onValueChange={setTab} className="mt-10">
      <TabsList value={tab} layoutId="pdp-tab" items={[{ value: 'details', label: 'Details' }, { value: 'size', label: 'Size chart' }, { value: 'reviews', label: 'Reviews', count }]} />
      <TabsContent value="details" className="mt-2">
        <Accordion type="single" collapsible defaultValue="m">
          <AccordionItem value="m" title="Material &amp; fit">{p.material}. {p.fit}.</AccordionItem>
          <AccordionItem value="c" title="Care">{p.care}</AccordionItem>
          <AccordionItem value="d" title="Delivery &amp; exchange">{deliveryInfo()}</AccordionItem>
        </Accordion>
      </TabsContent>
      <TabsContent value="size">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Ruler size={15} /> Garment measurements in inches</div>
        {chart.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No size chart for this product yet. Use the size assistant or message us for help.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="label-mono text-muted-foreground"><tr><th className="py-2">Size</th><th>{waist ? 'Waist' : 'Chest'}</th><th>Length</th><th>{waist ? 'Hem' : 'Collar'}</th></tr></thead>
            <tbody>{chart.map((r) => <tr key={r.size} className={cn('border-t border-border transition hover:bg-accent/10', size === r.size && 'bg-accent/15')}><td className="py-2.5 font-semibold">{r.size}</td><td>{r.a}</td><td>{r.b}</td><td>{r.c}</td></tr>)}</tbody>
          </table>
        )}
      </TabsContent>
      <TabsContent value="reviews"><ProductReviews p={p} /></TabsContent>
    </T.Root>
  )
}
