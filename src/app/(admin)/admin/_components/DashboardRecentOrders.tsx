'use client'

import Link from 'next/link'
import { Btn, Card, CardHeader } from '@/components/cms/ui'
import DataTable from '@/components/cms/DataTable'
import StatusBadge from '@/components/cms/StatusBadge'
import { useNavigate } from '@/lib/nav'
import { bdt } from '@/lib/utils'
import type { Order } from '@/data/orders'

export default function DashboardRecentOrders({ orders }: { orders: Order[] }) {
  const go = useNavigate()
  const rows = [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8)
  return (
    <Card>
      <CardHeader title="Recent orders" actions={<Link href="/admin/orders"><Btn size="sm">View all</Btn></Link>} />
      <DataTable
        rows={rows}
        rowKey={(o) => o.id}
        pageSize={8}
        onRowClick={(o) => go(`/admin/orders/?id=${o.id}`)}
        columns={[
          { key: 'id', header: 'Order', cell: (o) => <span className="font-medium text-primary">{o.id}</span> },
          { key: 'c', header: 'Customer', cell: (o) => o.customer.name },
          { key: 'd', header: 'Date', cell: (o) => new Date(o.createdAt).toLocaleDateString() },
          { key: 's', header: 'Status', cell: (o) => <StatusBadge status={o.status} /> },
          { key: 't', header: 'Total', align: 'right', cell: (o) => bdt(o.total) },
        ]}
      />
    </Card>
  )
}
