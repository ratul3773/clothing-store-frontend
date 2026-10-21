export type DayPoint = { key: string; label: string; revenue: number; orders: number }
export type LowStockRow = { id: string; name: string; sku: string; variant: string; qty: number }
export type TopProduct = { id: string; name: string; image: string; qty: number; revenue: number }
export type DashboardStats = {
  today: number
  week: number
  month: number
  orderCount: number
  pending: number
  aov: number
  newCustomers: number
  days: DayPoint[]
  byStatus: { status: string; count: number }[]
  top: TopProduct[]
}
