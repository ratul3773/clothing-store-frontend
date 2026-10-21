'use client'

import { Card, CardHeader, Field, Input } from '@/components/cms/ui'
import type { SectionProps } from './sectionProps'

export default function PricingSection({ d, errors = {}, patch }: SectionProps) {
  return (
    <Card>
      <CardHeader title="Pricing" description="Offer price must be lower than the regular price." />
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <Field label="Price (BDT) *" error={errors.price}>
          <Input type="number" min={0} value={d.price} onChange={(e) => patch({ price: e.target.value })} />
        </Field>
        <Field label="Offer price (BDT)" error={errors.offer} hint="Leave empty for no offer.">
          <Input type="number" min={0} value={d.offer} onChange={(e) => patch({ offer: e.target.value })} />
        </Field>
      </div>
    </Card>
  )
}
