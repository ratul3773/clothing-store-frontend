'use client'

import { useState } from 'react'
import { Card } from '@/components/cms/ui'
import { taxonomy } from '@/data/catalog'
import SubcategoriesPanel from './SubcategoriesPanel'
import SizeChartEditor from './SizeChartEditor'

export default function CategoryDetail({ cat }: { cat: string }) {
  const [tab, setTab] = useState<'subs' | 'chart'>('subs')
  const t = taxonomy.find((x) => x.cat === cat)
  if (!t) return null
  return (
    <Card>
      <div className="border-b border-border px-4 pt-3">
        <h3 className="text-sm font-semibold">{t.label}</h3>
        <div className="mt-2 flex gap-1">
          {([['subs', 'Subcategories'], ['chart', 'Size chart']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium ${tab === k ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{l}</button>
          ))}
        </div>
      </div>
      {tab === 'subs' ? <SubcategoriesPanel t={t} /> : <SizeChartEditor cat={t.cat} />}
    </Card>
  )
}
