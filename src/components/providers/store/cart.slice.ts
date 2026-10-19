import { createSlice, type Action } from './createSlice'
import type { Line } from './types'

type State = { lines: Line[]; open: boolean; coupon: string | null }

const bump = (ls: Line[], key: string, by: number) => ls.map((l) => (l.key === key ? { ...l, qty: l.qty + by } : l))

const cart = createSlice({
  name: 'cart',
  initialState: { lines: [], open: false, coupon: null } as State,
  reducers: {
    addLine: (s, { payload }: Action<{ line: Line; open: boolean }>) => {
      const { line, open } = payload
      const lines = s.lines.some((l) => l.key === line.key) ? bump(s.lines, line.key, line.qty) : [...s.lines, line]
      return { ...s, lines, open: open || s.open }
    },
    changeQty: (s, { payload }: Action<{ key: string; by: number }>) => ({
      ...s,
      lines: s.lines.map((l) => (l.key === payload.key ? { ...l, qty: Math.max(1, l.qty + payload.by) } : l)),
    }),
    removeLine: (s, { payload }: Action<string>) => ({ ...s, lines: s.lines.filter((l) => l.key !== payload) }),
    clear: (s) => ({ ...s, lines: [] }),
    setOpen: (s, { payload }: Action<boolean>) => ({ ...s, open: payload }),
    setCoupon: (s, { payload }: Action<string | null>) => ({ ...s, coupon: payload }),
  },
})
export default cart
