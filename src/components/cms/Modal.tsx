'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/cms/ui'

type Props = {
  open: boolean
  onOpenChange: (o: boolean) => void
  title: string
  description?: string
  variant?: 'modal' | 'drawer'
  size?: 'sm' | 'md' | 'lg'
  footer?: React.ReactNode
  children?: React.ReactNode
}

/** Flat, non-animated dialog / right-hand drawer for the CMS. */
export default function Modal({ open, onOpenChange, title, description, variant = 'modal', size = 'md', footer, children }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="cms fixed inset-0 z-[80] bg-black/40" />
        <Dialog.Content
          className={cn(
            'cms fixed z-[90] flex flex-col bg-card text-foreground shadow-xl outline-none',
            variant === 'drawer' ? 'right-0 top-0 h-dvh w-full max-w-xl border-l border-border' : 'left-1/2 top-1/2 max-h-[88dvh] w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border',
            variant === 'modal' && (size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-3xl' : 'max-w-lg'),
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-3">
            <div>
              <Dialog.Title className="text-sm font-semibold">{title}</Dialog.Title>
              <Dialog.Description className={cn('text-xs text-muted-foreground', !description && 'sr-only')}>{description ?? title}</Dialog.Description>
            </div>
            <Dialog.Close className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close"><X className="size-4" /></Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Delete', onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; description: string; confirmLabel?: string; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="sm"
      footer={
        <>
          <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmLabel}</Btn>
        </>
      }
    >
      <p className="text-[13px] text-muted-foreground">{description}</p>
    </Modal>
  )
}
