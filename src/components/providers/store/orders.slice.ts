import { seedOrders, type Order } from '@/data/orders'
import { createSlice, type Action } from './createSlice'

const orders = createSlice({
  name: 'orders',
  initialState: { items: seedOrders as Order[], stock: {} as Record<string, number> },
  reducers: {
    added: (s, { payload }: Action<Order>) => ({ ...s, items: [payload, ...s.items] }),
    patched: (s, { payload }: Action<{ id: string; patch: Partial<Order> }>) => ({
      ...s,
      items: s.items.map((o) => (o.id === payload.id ? { ...o, ...payload.patch } : o)),
    }),
    removed: (s, { payload }: Action<string>) => ({ ...s, items: s.items.filter((o) => o.id !== payload) }),
    stockSet: (s, { payload }: Action<{ key: string; value: number }>) => ({ ...s, stock: { ...s.stock, [payload.key]: Math.max(0, payload.value) } }),
  },
})
export default orders
