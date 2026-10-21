'use client'

import { useState } from 'react'
import { Btn, Select } from '@/components/cms/ui'
import { LIFECYCLE, statusLabel, type Status } from '@/data/orders'
import { EXTRA_STATUSES } from '@/app/(admin)/admin/orders/_constants/orders.constants'

export default function OrdersBulkBar({ count, onApply, onClear }: { count: number; onApply: (s: Status) => void; onClear: () => void }) {
  const [status, setStatus] = useState<Status | ''>('')
  if (!count) return null
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-blue-50 px-3 py-2 text-[13px]">
      <span className="font-medium">{count} selected</span>
      <Select className="w-48" value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Bulk status">
        <option value="">Change status to…</option>
        {[...LIFECYCLE, ...EXTRA_STATUSES].map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
      </Select>
      <Btn variant="primary" disabled={!status} onClick={() => { if (status) { onApply(status); setStatus('') } }}>Apply</Btn>
      <Btn variant="ghost" onClick={onClear}>Clear selection</Btn>
    </div>
  )
}
