'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, Btn, Card, PageHeader } from '@/components/cms/ui'
import DataTable from '@/components/cms/DataTable'
import StatusBadge from '@/components/cms/StatusBadge'
import { useStore } from '@/components/providers/StoreProvider'
import { useNavigate } from '@/lib/nav'
import { bdt } from '@/lib/utils'
import useOrderActions from '@/app/(admin)/admin/orders/_hooks/useOrderActions'
import { EMPTY_FILTERS, PAGE_SIZE, SOURCE_LABEL } from '@/app/(admin)/admin/orders/_constants/orders.constants'
import { filterOrders, fmtDate } from '@/app/(admin)/admin/orders/_utils/orders.utils'
import type { OrderFilters } from '@/app/(admin)/admin/orders/_types/orders.types'
import OrdersFilters from '@/app/(admin)/admin/orders/_components/OrdersFilters'
import OrdersBulkBar from '@/app/(admin)/admin/orders/_components/OrdersBulkBar'
import ManualOrderModal from '@/app/(admin)/admin/orders/_components/ManualOrderModal'

export default function OrdersList() {
  const { orders } = useStore()
  const go = useNavigate()
  const { bulkStatus } = useOrderActions()
  const [filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS)
  const [selected, setSelected] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const rows = useMemo(() => filterOrders(orders, filters), [orders, filters])
  const selectedOrders = orders.filter((o) => selected.includes(o.id))
  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${orders.length} orders in total`}
        actions={<Btn variant="primary" onClick={() => setCreating(true)}><Plus className="size-4" /> Create manual order</Btn>}
      />
      <Card>
        <OrdersFilters value={filters} onChange={(f) => { setFilters(f); setSelected([]) }} />
        <OrdersBulkBar count={selected.length} onClear={() => setSelected([])} onApply={(s) => { bulkStatus(selectedOrders, s); setSelected([]) }} />
        <DataTable
          rows={rows}
          rowKey={(o) => o.id}
          pageSize={PAGE_SIZE}
          resetKey={JSON.stringify(filters)}
          selected={selected}
          onSelect={setSelected}
          onRowClick={(o) => go(`/admin/orders/?id=${o.id}`)}
          columns={[
            { key: 'id', header: 'Order', cell: (o) => <span className="font-medium text-primary">{o.id}</span> },
            { key: 'date', header: 'Date', cell: (o) => <span className="text-muted-foreground">{fmtDate(o.createdAt)}</span> },
            { key: 'c', header: 'Customer', cell: (o) => <div><p className="font-medium">{o.customer.name}</p><p className="text-xs text-muted-foreground">{o.customer.phone}</p></div> },
            { key: 'src', header: 'Source', cell: (o) => SOURCE_LABEL[o.source] },
            { key: 'st', header: 'Status', cell: (o) => <StatusBadge status={o.status} /> },
            { key: 'pay', header: 'Payment', cell: (o) => <div className="flex items-center gap-1.5"><span className="text-xs">{o.payment}</span><Badge tone={o.paid ? 'green' : 'amber'}>{o.paid ? 'Paid' : 'Unpaid'}</Badge></div> },
            { key: 'cr', header: 'Courier', cell: (o) => o.courier ?? <span className="text-muted-foreground">—</span> },
            { key: 'tot', header: 'Total', align: 'right', cell: (o) => bdt(o.total) },
          ]}
        />
      </Card>
      <ManualOrderModal open={creating} onOpenChange={setCreating} />
    </div>
  )
}
