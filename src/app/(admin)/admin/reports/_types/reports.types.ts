export type RangeKey = '7d' | '30d' | '90d' | 'all'
export type Row = { label: string; orders: number; units: number; revenue: number }
export type Summary = { orders: number; gross: number; delivery: number; discount: number; net: number; aov: number; units: number; cancelled: number; paid: number }
