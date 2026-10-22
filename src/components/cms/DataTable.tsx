'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import usePagination from '@/lib/usePagination'
import { Btn, Empty } from '@/components/cms/ui'

export type Column<T> = { key: string; header: string; cell: (row: T) => React.ReactNode; className?: string; align?: 'right' }

type Props<T> = {
  rows: T[]
  columns: Column<T>[]
  rowKey: (row: T) => string
  pageSize?: number
  resetKey?: string
  onRowClick?: (row: T) => void
  selected?: string[]
  onSelect?: (keys: string[]) => void
  empty?: React.ReactNode
}

export default function DataTable<T>({ rows, columns, rowKey, pageSize = 10, resetKey, onRowClick, selected, onSelect, empty }: Props<T>) {
  const { page, setPage, pageCount, pageItems, total } = usePagination(rows, pageSize, resetKey)
  const keys = pageItems.map(rowKey)
  const allOn = selected && keys.length > 0 && keys.every((k) => selected.includes(k))
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
              {onSelect && (
                <th className="w-9 px-3 py-2">
                  <input type="checkbox" aria-label="Select all" checked={!!allOn} onChange={() => onSelect(allOn ? selected!.filter((k) => !keys.includes(k)) : Array.from(new Set([...(selected ?? []), ...keys])))} />
                </th>
              )}
              {columns.map((c) => (
                <th key={c.key} className={cn('px-3 py-2 font-medium', c.align === 'right' && 'text-right', c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((r) => {
              const k = rowKey(r)
              return (
                <tr key={k} onClick={onRowClick ? () => onRowClick(r) : undefined} className={cn('border-b border-border last:border-0 hover:bg-muted/40', onRowClick && 'cursor-pointer')}>
                  {onSelect && (
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" aria-label="Select row" checked={selected?.includes(k) ?? false} onChange={() => onSelect(selected?.includes(k) ? selected.filter((x) => x !== k) : [...(selected ?? []), k])} />
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key} className={cn('px-3 py-2 align-middle', c.align === 'right' && 'text-right tabular-nums', c.className)}>{c.cell(r)}</td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {total === 0 && (empty ?? <Empty title="No records found" description="Try changing your filters." />)}
      {total > 0 && (
        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Btn size="icon" className="size-7" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></Btn>
            <span className="px-2">Page {page} / {pageCount}</span>
            <Btn size="icon" className="size-7" disabled={page >= pageCount} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight className="size-4" /></Btn>
          </div>
        </div>
      )}
    </div>
  )
}
