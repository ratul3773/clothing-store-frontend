import { createSlice, type Action } from './createSlice'

export type Toast = { id: string; msg: string }

const toasts = createSlice({
  name: 'toasts',
  initialState: [] as Toast[],
  reducers: {
    pushed: (s, { payload }: Action<Toast>) => [...s, payload],
    dismissed: (s, { payload }: Action<string>) => s.filter((t) => t.id !== payload),
  },
})
export default toasts
