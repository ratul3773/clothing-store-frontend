'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'theme'

type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void }
const C = createContext<Ctx>({ theme: 'light', setTheme: () => {}, toggle: () => {} })
export const useTheme = () => useContext(C)

/** Runs before hydration (see layout) to avoid a flash of the wrong theme. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => setThemeState(document.documentElement.classList.contains('dark') ? 'dark' : 'light'), [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    document.documentElement.classList.toggle('dark', t === 'dark')
    try {
      localStorage.setItem(KEY, t)
    } catch {}
  }, [])
  const toggle = useCallback(() => setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'), [setTheme])

  return <C.Provider value={{ theme, setTheme, toggle }}>{children}</C.Provider>
}
