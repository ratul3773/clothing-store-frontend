'use client'

import { useMemo } from 'react'
import { customerMeta } from '@/data/cms'
import { useCms } from '@/lib/useCms'
import { useStore } from '@/components/providers/StoreProvider'
import { buildCustomers } from '@/app/(admin)/admin/customers/_utils/customers.utils'

export default function useCustomers() {
  const v = useCms()
  const { orders } = useStore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildCustomers(orders, customerMeta), [orders, v])
}
