'use client'

import { useSearchParams } from '@/lib/nav'
import { useCms } from '@/lib/useCms'
import { PageHeader } from '@/components/cms/ui'
import { cn } from '@/lib/utils'
import CouponsTab from './CouponsTab'
import CombosTab from './CombosTab'

const tabs = [{ id: 'coupons', label: 'Coupons' }, { id: 'combos', label: 'Combos' }]

export default function CouponsView() {
  useCms()
  const [sp, setSp] = useSearchParams()
  const tab = sp.get('tab') === 'combos' ? 'combos' : 'coupons'
  return (
    <>
      <PageHeader title="Coupons & combos" description="Discount codes and bundled outfit deals." crumbs={['Admin', 'Coupons']} />
      <div className="mb-4 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setSp({ tab: t.id })} className={cn('-mb-px border-b-2 px-3 py-2 text-[13px] font-medium', tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'coupons' ? <CouponsTab /> : <CombosTab />}
    </>
  )
}
