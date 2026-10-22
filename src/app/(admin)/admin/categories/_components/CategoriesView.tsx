'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Btn, PageHeader } from '@/components/cms/ui'
import { useCms } from '@/lib/useCms'
import { listCategories } from '../_services/categories.api'
import CategoriesTable from './CategoriesTable'
import CategoryDetail from './CategoryDetail'
import CategoryModal from './CategoryModal'

export default function CategoriesView() {
  useCms()
  const cats = listCategories()
  const [sel, setSel] = useState<string | null>(null)
  const [modal, setModal] = useState<{ prev?: string } | null>(null)
  const active = cats.find((c) => c.cat === sel) ?? cats[0]

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage categories, subcategories and size charts."
        crumbs={['Catalog', 'Categories']}
        actions={
          <CategoryModal
            open={!!modal}
            prev={modal?.prev}
            onOpen={() => setModal({})}
            onClose={() => setModal(null)}
            onSaved={(cat) => setSel(cat)}
            trigger={<Btn variant="primary"><Plus className="size-4" />Add category</Btn>}
          />
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <CategoriesTable selected={active?.cat} onSelect={setSel} onEdit={(c) => setModal({ prev: c })} onDeleted={(c) => c === sel && setSel(null)} />
        {active && <CategoryDetail key={active.cat} cat={active.cat} />}
      </div>
    </div>
  )
}
