'use client'

import { useMemo, useState } from 'react'
import { Download, Search } from 'lucide-react'
import { bdt } from '@/lib/utils'
import { Badge, Btn, Card, Input, Select, StatCard, Toolbar, PageHeader, type Tone } from '@/components/cms/ui'
import DataTable from '@/components/cms/DataTable'
import useCustomers from '@/app/(admin)/admin/customers/_hooks/useCustomers'
import { SEGMENTS, SORTS } from '@/app/(admin)/admin/customers/_constants/customers.constants'
import type { Customer, Segment, SortKey } from '@/app/(admin)/admin/customers/_types/customer.types'
import { customersCsv, downloadCsv, fmtDate } from '@/app/(admin)/admin/customers/_utils/customers.utils'
import CustomerDrawer from '@/app/(admin)/admin/customers/_components/CustomerDrawer'

export const segTone: Record<Segment, Tone> = { New: 'blue', Repeat: 'green', VIP: 'violet', 'Guest-only': 'gray' }

export default function CustomersTable() {
  const all = useCustomers()
  const [q, setQ] = useState('')
  const [seg, setSeg] = useState('')
  const [blocked, setBlocked] = useState('')
  const [sort, setSort] = useState<SortKey>('recent')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return all
      .filter((c) => (!s || `${c.name} ${c.phone} ${c.email} ${c.tags.join(' ')}`.toLowerCase().includes(s)) && (!seg || c.segment === seg) && (!blocked || (blocked === 'yes') === c.blocked))
      .sort((a, b) => (sort === 'spend' ? b.spend - a.spend : sort === 'orders' ? b.orderCount - a.orderCount : b.lastOrder.localeCompare(a.lastOrder)))
  }, [all, q, seg, blocked, sort])

  const selected = all.find((c) => c.key === openKey) ?? null
  const totalSpend = all.reduce((s, c) => s + c.spend, 0)

  return (
    <>
      <PageHeader
        title="Customers"
        description="Derived from orders, grouped by phone number."
        crumbs={['Admin', 'Customers']}
        actions={<Btn onClick={() => downloadCsv('customers.csv', customersCsv(rows))} disabled={!rows.length}><Download className="size-4" />Export CSV</Btn>}
      />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Customers" value={all.length} />
        <StatCard label="VIP" value={all.filter((c) => c.segment === 'VIP').length} />
        <StatCard label="Repeat buyers" value={all.filter((c) => c.orderCount > 1).length} />
        <StatCard label="Lifetime revenue" value={bdt(totalSpend)} />
      </div>
      <Card>
        <Toolbar>
          <div className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search name, phone, email, tag" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select className="w-36" value={seg} onChange={(e) => setSeg(e.target.value)} aria-label="Segment">
            <option value="">All segments</option>
            {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select className="w-36" value={blocked} onChange={(e) => setBlocked(e.target.value)} aria-label="Blocked">
            <option value="">Blocked: any</option>
            <option value="yes">Blocked</option>
            <option value="no">Not blocked</option>
          </Select>
          <Select className="w-40" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </Toolbar>
        <DataTable<Customer>
          rows={rows}
          rowKey={(c) => c.key}
          resetKey={`${q}|${seg}|${blocked}|${sort}`}
          onRowClick={(c) => setOpenKey(c.key)}
          columns={[
            { key: 'name', header: 'Customer', cell: (c) => <div><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.phone}</p></div> },
            { key: 'seg', header: 'Segment', cell: (c) => <span className="flex gap-1"><Badge tone={segTone[c.segment]}>{c.segment}</Badge>{c.blocked && <Badge tone="red">Blocked</Badge>}</span> },
            { key: 'orders', header: 'Orders', align: 'right', cell: (c) => c.orderCount },
            { key: 'spend', header: 'Lifetime spend', align: 'right', cell: (c) => bdt(c.spend) },
            { key: 'aov', header: 'AOV', align: 'right', cell: (c) => bdt(c.aov) },
            { key: 'last', header: 'Last order', cell: (c) => fmtDate(c.lastOrder) },
          ]}
        />
      </Card>
      <CustomerDrawer customer={selected} onClose={() => setOpenKey(null)} />
    </>
  )
}
