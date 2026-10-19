import { createSlice, type Action } from './createSlice'
import type { User } from './types'

const session = createSlice({
  name: 'session',
  initialState: { user: null as User | null, authOpen: false },
  reducers: {
    setUser: (s, { payload }: Action<User | null>) => ({ ...s, user: payload }),
    setAuthOpen: (s, { payload }: Action<boolean>) => ({ ...s, authOpen: payload }),
  },
})
export default session
