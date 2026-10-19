// Minimal createSlice with the same shape as Redux Toolkit's, so migrating is an import swap.
export type Action<P = unknown> = { type: string; payload: P }
type Reducers<S> = Record<string, (state: S, action: Action<any>) => S>
type Creators<R extends Reducers<any>> = {
  [K in keyof R]: R[K] extends (s: any, a: Action<infer P>) => any ? (unknown extends P ? () => Action<undefined> : (payload: P) => Action<P>) : never
}

export function createSlice<S, R extends Reducers<S>>(cfg: { name: string; initialState: S; reducers: R }) {
  const actions = {} as Creators<R>
  const byType: Record<string, (state: S, action: Action<any>) => S> = {}
  for (const key of Object.keys(cfg.reducers)) {
    const type = `${cfg.name}/${key}`
    byType[type] = cfg.reducers[key]
    ;(actions as Record<string, unknown>)[key] = (payload?: unknown) => ({ type, payload })
  }
  const reducer = (state: S = cfg.initialState, action: Action): S => (byType[action.type] ? byType[action.type](state, action) : state)
  return { name: cfg.name, initialState: cfg.initialState, reducer, actions }
}
