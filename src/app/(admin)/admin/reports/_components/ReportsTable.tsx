import { Card, CardHeader } from '@/components/cms/ui'
import DataTable from '@/components/cms/DataTable'
import { bdt } from '@/lib/utils'
import type { Row } from '@/app/(admin)/admin/reports/_types/reports.types'

export default function ReportsTable({ title, firstHeader, rows, pageSize = 8 }: { title: string; firstHeader: string; rows: Row[]; pageSize?: number }) {
  const total = rows.reduce((a, r) => a + r.revenue, 0) || 1
  return (
    <Card>
      <CardHeader title={title} />
      <DataTable
        rows={rows}
        rowKey={(r) => r.label}
        pageSize={pageSize}
        resetKey={String(rows.length)}
        columns={[
          { key: 'l', header: firstHeader, cell: (r) => <span className="font-medium">{r.label}</span> },
          { key: 'o', header: 'Orders', align: 'right', cell: (r) => r.orders },
          { key: 'u', header: 'Units', align: 'right', cell: (r) => r.units },
          { key: 'r', header: 'Revenue', align: 'right', cell: (r) => bdt(r.revenue) },
          { key: 'p', header: 'Share', align: 'right', cell: (r) => `${Math.round((r.revenue / total) * 100)}%` },
        ]}
      />
    </Card>
  )
}
