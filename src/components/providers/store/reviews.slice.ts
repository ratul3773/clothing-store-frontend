import { seedReviews, type Review } from '@/data/reviews'
import { createSlice, type Action } from './createSlice'

const reviews = createSlice({
  name: 'reviews',
  initialState: { items: seedReviews as Review[] },
  reducers: {
    added: (s, { payload }: Action<Review>) => ({ items: [payload, ...s.items] }),
    patched: (s, { payload }: Action<{ id: string; patch: Partial<Review> }>) => ({
      items: s.items.map((r) => (r.id === payload.id ? { ...r, ...payload.patch } : r)),
    }),
    removed: (s, { payload }: Action<string>) => ({ items: s.items.filter((r) => r.id !== payload) }),
  },
})
export default reviews
