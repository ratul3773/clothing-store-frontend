'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (o: boolean) => void
  title?: string
  description?: string
  side?: 'right' | 'center'
  children: React.ReactNode
  className?: string
}

export function Sheet({ open, onOpenChange, title, description, side = 'center', children, className }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-90 bg-foreground/60 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.div
                className={cn(
                  'fixed z-90 flex flex-col bg-card text-card-foreground shadow-2xl outline-none',
                  side === 'right'
                    ? 'right-0 top-0 h-dvh w-full max-w-md'
                    : 'left-1/2 top-1/2 max-h-[90dvh] w-[min(92vw,34rem)] overflow-y-auto rounded-md',
                  className,
                )}
                initial={side === 'right' ? { x: '100%' } : { opacity: 0, y: 30, x: '-50%', scale: 0.96 }}
                animate={side === 'right' ? { x: 0 } : { opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
                exit={side === 'right' ? { x: '100%' } : { opacity: 0, y: 0, x: '-50%', scale: 0.97 }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              >
                <div className="flex items-start justify-between gap-4 border-b border-border p-5">
                  <div>
                    <Dialog.Title className="font-display text-xl">{title}</Dialog.Title>
                    <Dialog.Description className={description ? 'mt-5 text-sm text-muted-foreground' : 'sr-only'}>
                      {description ?? title}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    aria-label="Close"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition hover:rotate-90 hover:bg-foreground hover:text-background"
                  >
                    <X size={16} />
                  </Dialog.Close>
                </div>
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
