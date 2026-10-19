import { createSlice, type Action } from './createSlice'

const wishlist = createSlice({
  name: 'wishlist',
  initialState: { ids: ['p3'], recent: [] as string[] },
  reducers: {
    toggle: (s, { payload }: Action<string>) => ({ ...s, ids: s.ids.includes(payload) ? s.ids.filter((x) => x !== payload) : [...s.ids, payload] }),
    pushRecent: (s, { payload }: Action<string>) => ({ ...s, recent: [payload, ...s.recent.filter((x) => x !== payload)].slice(0, 8) }),
  },
})
export default wishlist
