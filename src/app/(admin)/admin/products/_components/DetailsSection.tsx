'use client'

import { Card, CardHeader, Field, Input, Textarea } from '@/components/cms/ui'
import type { SectionProps } from './sectionProps'

export default function DetailsSection({ d, patch }: SectionProps) {
  return (
    <Card>
      <CardHeader title="Details" />
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <Field label="Material"><Input value={d.material} onChange={(e) => patch({ material: e.target.value })} /></Field>
        <Field label="Fit"><Input value={d.fit} onChange={(e) => patch({ fit: e.target.value })} /></Field>
        <Field label="Care instructions" className="sm:col-span-2"><Input value={d.care} onChange={(e) => patch({ care: e.target.value })} /></Field>
        <Field label="Description" className="sm:col-span-2"><Textarea rows={4} value={d.desc} onChange={(e) => patch({ desc: e.target.value })} /></Field>
      </div>
    </Card>
  )
}
