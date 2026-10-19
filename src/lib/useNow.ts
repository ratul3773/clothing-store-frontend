'use client'

import { useEffect, useState } from 'react'

/** Current timestamp ticking every `ms`. Returns null until mounted so SSR and hydration agree. */
export default function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    const initial = setTimeout(() => setNow(Date.now()), 0)
    const t = setInterval(() => setNow(Date.now()), ms)
    return () => {
      clearTimeout(initial)
      clearInterval(t)
    }
  }, [ms])
  return now
}
