'use client'

import { AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AddressCard from '@/app/(store)/account/_components/AddressCard'
import AddressFormSheet from '@/app/(store)/account/_components/AddressFormSheet'
import DeleteAddressSheet from '@/app/(store)/account/_components/DeleteAddressSheet'
import useAddressBook from '@/app/(store)/account/_hooks/useAddressBook'

export default function AddressesTab() {
  const b = useAddressBook()
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="label-mono text-muted-foreground">{b.list.length} saved</p>
        <Button size="sm" variant="accent" onClick={b.startNew}><Plus size={14} /> Add address</Button>
      </div>
      {b.list.length === 0 && <p className="py-10 text-muted-foreground">No saved addresses. Add one to speed up checkout.</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {b.list.map((a) => (
            <AddressCard key={a.id} a={a} onEdit={() => b.setForm(a)} onMakeDefault={() => b.makeDefault(a)} onDelete={() => b.setDel(a)} />
          ))}
        </AnimatePresence>
      </div>
      <AddressFormSheet form={b.form} setForm={b.setForm} valid={b.valid} onSave={b.save} />
      <DeleteAddressSheet del={b.del} onClose={() => b.setDel(null)} onConfirm={b.remove} />
    </div>
  )
}
