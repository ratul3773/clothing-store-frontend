'use client'

import { Pick } from '@/components/ui/controls'
import { SORT_OPTIONS } from '@/app/(store)/shop/_constants/shop.constants'

export default function ProductSort({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <Pick label="Sort" value={value} onChange={onChange} className="w-52" options={SORT_OPTIONS} />
}
