'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { banners, type Banner } from '@/data/site'
import { deleteBanner, saveBanner, uid } from '@/data/cms'
import { useCms } from '@/lib/useCms'
import { useStore } from '@/components/providers/StoreProvider'
import DataTable from '@/components/cms/DataTable'
import { ConfirmDialog } from '@/components/cms/Modal'
import { Badge, Btn, Card, Empty, PageHeader, Switch } from '@/components/cms/ui'
import { sampleBanners, scheduleLabel } from '../_utils/banner.utils'
import BannerForm from './BannerForm'

export default function BannersView() {
  useCms()
  const { toast } = useStore()
  const [editing, setEditing] = useState<Banner | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [del, setDel] = useState<Banner | null>(null)
  const sorted = [...banners].sort((a, b) => a.order - b.order)
  const open = (b: Banner | null) => { setEditing(b); setFormOpen(true) }

  const move = (b: Banner, dir: -1 | 1) => {
    const group = sorted.filter((x) => x.placement === b.placement)
    const i = group.findIndex((x) => x.id === b.id)
    const other = group[i + dir]
    if (!other) return
    if (other.order === b.order) {
      // tied orders: normalise the group first so the swap is meaningful
      group.forEach((x, idx) => saveBanner({ ...x, order: idx + 1 }))
      const g2 = [...group]
      ;[g2[i], g2[i + dir]] = [g2[i + dir], g2[i]]
      g2.forEach((x, idx) => saveBanner({ ...x, order: idx + 1 }))
      return
    }
    saveBanner({ ...b, order: other.order })
    saveBanner({ ...other, order: b.order })
  }

  const loadSamples = () => {
    sampleBanners().forEach((b) => saveBanner({ ...b, id: uid('b') }))
    toast('Sample banners added')
  }

  return (
    <>
      <PageHeader title="Banners" description="Hero slides and promo banners shown on the storefront." crumbs={['Admin', 'Banners']} actions={<Btn variant="primary" onClick={() => open(null)}><Plus className="size-4" />New banner</Btn>} />
      <Card>
        <DataTable
          rows={sorted}
          rowKey={(b) => b.id}
          onRowClick={open}
          empty={<Empty title="No banners yet" description="The storefront hero falls back to its default until you add an active hero banner." action={<Btn variant="primary" onClick={loadSamples}><Sparkles className="size-4" />Load sample banners</Btn>} />}
          columns={[
            { key: 'img', header: 'Preview', cell: (b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.image} alt="" className="h-12 w-24 rounded border border-border object-cover" />
            ) },
            { key: 'title', header: 'Banner', cell: (b) => <div><p className="font-medium">{b.title}</p><p className="max-w-xs truncate text-xs text-muted-foreground">{b.subtitle}</p></div> },
            { key: 'pl', header: 'Placement', cell: (b) => <Badge tone={b.placement === 'hero' ? 'blue' : 'violet'}>{b.placement === 'hero' ? 'Hero' : 'Promo'}</Badge> },
            { key: 'ord', header: 'Order', cell: (b) => (
              <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <span className="w-5 tabular-nums">{b.order}</span>
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Move up" onClick={() => move(b, -1)}><ArrowUp className="size-3.5" /></Btn>
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Move down" onClick={() => move(b, 1)}><ArrowDown className="size-3.5" /></Btn>
              </span>
            ) },
            { key: 'sch', header: 'Schedule', cell: (b) => <span className="text-muted-foreground">{scheduleLabel(b)}</span> },
            { key: 'cta', header: 'CTA', cell: (b) => b.ctaLabel ? <span>{b.ctaLabel} <span className="text-xs text-muted-foreground">{b.ctaLink}</span></span> : '-' },
            { key: 'act', header: 'Active', cell: (b) => <span onClick={(e) => e.stopPropagation()}><Switch checked={b.active} onChange={(v) => { saveBanner({ ...b, active: v }); toast(v ? 'Banner activated' : 'Banner deactivated') }} /></span> },
            { key: 'ops', header: '', align: 'right', cell: (b) => (
              <span className="inline-flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Btn size="icon" variant="ghost" aria-label="Edit" onClick={() => open(b)}><Pencil className="size-4" /></Btn>
                <Btn size="icon" variant="ghost" aria-label="Delete" onClick={() => setDel(b)}><Trash2 className="size-4 text-red-600" /></Btn>
              </span>
            ) },
          ]}
        />
      </Card>
      <BannerForm open={formOpen} onOpenChange={setFormOpen} banner={editing} />
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} title="Delete banner" description={`Delete "${del?.title}"?`} onConfirm={() => { if (del) { deleteBanner(del.id); toast('Banner deleted') } }} />
    </>
  )
}
