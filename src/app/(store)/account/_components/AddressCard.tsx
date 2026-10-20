'use client'

import { motion } from 'motion/react'
import { MapPin, Pencil, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Address } from '@/components/providers/StoreProvider'
import { cn } from '@/lib/utils'

interface Props {
  a: Address
  onEdit: () => void
  onMakeDefault: () => void
  onDelete: () => void
}

export default function AddressCard({ a, onEdit, onMakeDefault, onDelete }: Props) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn('flex flex-col rounded-[3px] border p-5 transition hover:border-foreground', a.isDefault ? 'border-accent bg-accent/5' : 'border-border')}>
      <div className="mb-3 flex items-start justify-between">
        <MapPin className="text-accent" />
        {a.isDefault && <span className="label-mono rounded-full bg-accent px-2.5 py-1 text-accent-foreground">Default</span>}
      </div>
      <p className="font-display text-lg sm:text-xl">{a.label}</p>
      <p className="text-sm">{a.name} · {a.phone}</p>
      <p className="text-sm text-muted-foreground">{a.line}, {a.city}</p>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" onClick={onEdit}><Pencil size={13} /> Edit</Button>
        {!a.isDefault && <Button size="sm" variant="ghost" onClick={onMakeDefault}><Star size={13} /> Make default</Button>}
        <Button size="sm" variant="ghost" className="ml-auto text-accent" onClick={onDelete}><Trash2 size={13} /> Delete</Button>
      </div>
    </motion.div>
  )
}
