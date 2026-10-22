'use client'

import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import DataTable from '@/components/cms/DataTable'
import AlertDialogText from '@/components/common/Alert-Dialogue'
import { Btn, Card, CardHeader } from '@/components/cms/ui'
import { useStore } from '@/components/providers/StoreProvider'
import { cn } from '@/lib/utils'
import type { Taxon } from '@/data/catalog'
import { countProducts, listCategories, removeCategory } from '../_services/categories.api'

type Props = { selected?: string; onSelect: (cat: string) => void; onEdit: (cat: string) => void; onDeleted: (cat: string) => void }

export default function CategoriesTable({ selected, onSelect, onEdit, onDeleted }: Props) {
  const { toast } = useStore()
  const [del, setDel] = useState<Taxon | null>(null)
  const [blocked, setBlocked] = useState<string | null>(null)

  const ask = (t: Taxon) => {
    const n = countProducts(t.cat)
    if (n > 0) setBlocked(`Cannot delete "${t.label}": ${n} product${n === 1 ? '' : 's'} still use this category. Move or delete them first.`)
    else setDel(t)
  }

  return (
    <Card>
      <CardHeader title="Categories" description="Select a row to manage its subcategories and size chart." />
      {blocked && (
        <div className="flex items-start justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          <span>{blocked}</span>
          <button className="font-medium underline" onClick={() => setBlocked(null)}>Dismiss</button>
        </div>
      )}
      <DataTable
        rows={listCategories()}
        rowKey={(t) => t.cat}
        pageSize={20}
        onRowClick={(t) => onSelect(t.cat)}
        columns={[
          {
            key: 'label', header: 'Category',
            cell: (t) => (
              <div className={cn('flex items-center gap-2.5', selected === t.cat && 'text-primary')}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {t.image ? <img src={t.image} alt="" className="size-10 rounded border border-border object-cover" /> : <div className="size-10 rounded border border-border bg-muted" />}
                <div>
                  <p className="font-medium">{t.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.cat}</p>
                </div>
              </div>
            ),
          },
          { key: 'blurb', header: 'Blurb', className: 'max-w-56', cell: (t) => <span className="line-clamp-2 text-xs text-muted-foreground">{t.blurb || '-'}</span> },
          { key: 'subs', header: 'Subs', align: 'right', cell: (t) => t.subs.length },
          { key: 'products', header: 'Products', align: 'right', cell: (t) => countProducts(t.cat) },
          {
            key: 'actions', header: '', align: 'right',
            cell: (t) => (
              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                <Btn size="icon" variant="ghost" className="size-7" aria-label="Edit" onClick={() => onEdit(t.cat)}><Pencil className="size-3.5" /></Btn>
                <Btn size="icon" variant="ghost" className="size-7 text-red-600" aria-label="Delete" onClick={() => ask(t)}><Trash2 className="size-3.5" /></Btn>
              </div>
            ),
          },
        ]}
      />
      <AlertDialogText
        mode="normal"
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        title="Delete category?"
        description={`"${del?.label}" and its size chart will be removed. This cannot be undone.`}
        actionType="delete"
        onConfirm={() => {
          if (!del) return
          const err = removeCategory(del.cat)
          if (err) setBlocked(err)
          else {
            toast('Category deleted')
            onDeleted(del.cat)
          }
        }}
      />
    </Card>
  )
}
