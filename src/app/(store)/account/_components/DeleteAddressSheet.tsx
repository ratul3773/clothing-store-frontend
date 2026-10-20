'use client'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import type { Address } from '@/components/providers/StoreProvider'

interface Props {
  del: Address | null
  onClose: () => void
  onConfirm: (a: Address) => void
}

export default function DeleteAddressSheet({ del, onClose, onConfirm }: Props) {
  return (
    <Sheet open={!!del} onOpenChange={(b) => !b && onClose()} title="Delete address?" description="This cannot be undone." side="center">
      {del && (
        <div className="space-y-4 p-5">
          <p className="text-sm"><b>{del.label}</b> — {del.line}, {del.city}</p>
          <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={onClose}>Keep</Button><Button variant="accent" className="flex-1" onClick={() => onConfirm(del)}>Delete</Button></div>
        </div>
      )}
    </Sheet>
  )
}
