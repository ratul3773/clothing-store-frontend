'use client'
import { useCallback } from 'react'
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'

export function useNavigate() {
  const router = useRouter()
  return useCallback((to: string) => router.push(to), [router])
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>) => void] {
  const sp = useNextSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const set = useCallback(
    (next: URLSearchParams | Record<string, string>) => {
      const qs = new URLSearchParams(next).toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname],
  )
  return [new URLSearchParams(sp.toString()), set]
}
