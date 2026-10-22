'use client'

import { Card, CardHeader, Field, Input, Select } from '@/components/cms/ui'
import { taxonomy } from '@/data/catalog'
import { slugify } from '@/data/cms'
import type { SectionProps } from './sectionProps'
import BadgeInput from './BadgeInput'

export default function BasicSection({ d, errors = {}, patch }: SectionProps) {
  const subs = taxonomy.find((t) => t.cat === d.category)?.subs ?? []
  return (
    <Card>
      <CardHeader title="Basic information" />
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        <Field label="Name *" error={errors.name} className="sm:col-span-2">
          <Input value={d.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Dhaka Oxford Shirt" />
        </Field>
        <Field label="Slug *" error={errors.slug} hint="Used in the product URL. Auto-generated from the name until edited.">
          <Input value={d.slug} onChange={(e) => patch({ slug: slugify(e.target.value), slugTouched: true })} />
        </Field>
        <Field label="SKU *" error={errors.sku}>
          <Input value={d.sku} onChange={(e) => patch({ sku: e.target.value.toUpperCase() })} placeholder="SH-OX-001" />
        </Field>
        <Field label="Category *" error={errors.category}>
          <Select value={d.category} onChange={(e) => patch({ category: e.target.value, sub: taxonomy.find((t) => t.cat === e.target.value)?.subs[0] ?? '' })}>
            <option value="">Select category</option>
            {taxonomy.map((t) => <option key={t.cat} value={t.cat}>{t.label}</option>)}
          </Select>
        </Field>
        <Field label="Subcategory *" error={errors.sub}>
          <Select value={d.sub} disabled={!d.category} onChange={(e) => patch({ sub: e.target.value })}>
            <option value="">Select subcategory</option>
            {subs.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={d.status} onChange={(e) => patch({ status: e.target.value as 'active' | 'draft' })}>
            <option value="active">Active (visible in store)</option>
            <option value="draft">Draft (hidden)</option>
          </Select>
        </Field>
        <div>
          <span className="mb-1 block text-xs font-medium text-foreground/80">Badges</span>
          <BadgeInput value={d.badges} onChange={(badges) => patch({ badges })} />
        </div>
      </div>
    </Card>
  )
}
