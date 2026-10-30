'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

type Ctx = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const C = createContext<Ctx>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
})

export const useTheme = () => useContext(C)

export const themeInitScript = `
  (function () {
    try {
      const stored = localStorage.getItem('theme');
      const theme = stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {}
  })();
`

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    )
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')

    try {
      localStorage.setItem('theme', nextTheme)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setTheme(
      document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    )
  }, [setTheme])

  return (
    <C.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </C.Provider>
  )
}