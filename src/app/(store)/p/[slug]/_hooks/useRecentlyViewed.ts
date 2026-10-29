// lib/useRecentlyViewed.ts
'use client'

import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'recently-viewed-ids'
const MAX = 5
const EMPTY: string[] = []

let cache: string[] | null = null
const listeners = new Set<() => void>()

function read(): string[] {
  if (cache) return cache
  try { cache = JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { cache = [] }
  return cache!
}

function write(ids: string[]) {
  cache = ids
  try { localStorage.setItem(KEY, JSON.stringify(ids)) } catch {}
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function useRecentlyViewed() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY)

  const push = useCallback((id: string) => {
    const current = read()
    if (current[0] === id) return
    write([id, ...current.filter((i) => i !== id)].slice(0, MAX))
  }, [])

  return { ids, push }
}