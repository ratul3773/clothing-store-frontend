'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Empty } from '@/components/cms/ui'
import { Skeleton } from '@/components/ui/skeleton'

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
  /** Hide the built-in pagination when the caller paginates on the server. */
  hidePagination?: boolean
  isLoading?: boolean
}

export default function DataTable<T>({ rows, columns, rowKey, pageSize = 10, resetKey, onRowClick, selected, onSelect, empty, hidePagination, isLoading }: Props<T>) {
  const total =  rows.length
  const keys = rows.map(rowKey)
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
            {isLoading ? (
              Array.from({ length: Math.min(pageSize, 6) }, (_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-border last:border-0">
                  {onSelect && <td className="px-3 py-4"><Skeleton className="size-4 rounded" /></td>}
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-4">
                      <Skeleton className={column === columns[0] ? "h-9 w-4/5 rounded-sm" : "h-4 w-3/5 rounded-sm"} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              rows.map((r) => {
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
              })
            )}
          </tbody>
        </table>
      </div>
      {total === 0 && !isLoading && (empty ?? <Empty title="No records found" description="Try changing your filters." />)}
    </div>
  )
}
