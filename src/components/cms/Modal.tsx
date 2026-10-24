'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  footer?: React.ReactNode
  children?: React.ReactNode
  trigger?: React.ReactNode
}

/** Flat, non-animated dialog / right-hand drawer for the CMS. */
export default function Modal({ open, onOpenChange, title, description, size = 'md', footer, children, trigger }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className={cn(
          'cms flex flex-col gap-0 rounded-lg border border-border bg-card p-0 text-foreground shadow-xl outline-none',
          // variant === 'drawer'
          //   ? 'left-auto top-0 h-dvh max-h-dvh w-full max-w-xl translate-x-0 translate-y-0 rounded-none border-y-0 border-r-0 sm:max-w-xl'
          //   :
            'max-h-[88dvh] w-[92vw] max-w-sm sm:max-w-3xl',
           size === 'md' && 'sm:max-w-lg',
           size === 'lg' && 'sm:max-w-3xl',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-3">
          <div>
            <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
            <DialogDescription className={cn('text-xs text-muted-foreground', !description && 'sr-only')}>{description ?? title}</DialogDescription>
          </div>
          <DialogClose className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close"><X className="size-4" /></DialogClose>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
