'use client'
import { useEffect, useMemo, useState } from 'react'

export default function usePagination<T>(items: T[], pageSize: number, resetKey?: string) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(page, pageCount)
  useEffect(() => setPage(1), [resetKey])
  const pageItems = useMemo(() => items.slice((current - 1) * pageSize, current * pageSize), [items, current, pageSize])
  return { page: current, setPage, pageCount, pageItems, total: items.length }
}
