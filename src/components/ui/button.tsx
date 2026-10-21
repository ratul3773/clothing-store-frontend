'use client'

import * as React from 'react'
import Link from 'next/link'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const customerButtonVariants = cva(
  [
    'group/btn relative inline-flex max-w-full shrink-0 cursor-pointer',
    'items-center justify-center gap-1.5 sm:gap-2',
    'overflow-hidden whitespace-nowrap font-semibold',
    'tracking-[0.04em] sm:tracking-[0.08em]',
    'transition-[color,transform,box-shadow] duration-300',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-40',
    'before:absolute before:inset-0 before:-z-0',
    'before:translate-y-[101%] before:transition-transform',
    'before:duration-500 before:ease-[cubic-bezier(.7,0,.2,1)]',
    'hover:before:translate-y-0',
  ].join(' '),
  {
    variants: {
      variant: {
        solid:
          'bg-primary text-primary-foreground before:bg-accent hover:text-accent-foreground',
        accent:
          'bg-accent text-accent-foreground before:bg-primary hover:text-primary-foreground',
        outline:
          'border border-foreground/70 text-foreground before:bg-foreground hover:text-background',
        ghost: 'text-foreground before:bg-foreground/10',
        light:
          'bg-card text-foreground before:bg-accent hover:text-accent-foreground',
      },
      size: {
        xs: 'h-6 gap-1 rounded-md px-2 text-xs',
        sm: 'h-8 px-3 text-[0.65rem] sm:h-9 sm:px-4 sm:text-xs',
        md: 'h-10 px-4 text-[0.7rem] sm:h-11 sm:px-6 sm:text-xs',
        lg: 'h-12 px-5 text-xs sm:h-14 sm:px-8 sm:text-sm',
        icon: 'size-9 text-xs sm:size-10',
        'icon-xs': 'size-6',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
      shape: {
        square: 'rounded-[3px]',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      shape: 'square',
    },
  },
)

const adminButtonVariants = cva(
  [
    'group/button inline-flex shrink-0 items-center justify-center cursor-pointer select-none overflow-hidden',
    'rounded-lg border border-transparent bg-clip-padding',
    'text-sm font-medium whitespace-nowrap transition-all outline-none',
    'select-none focus-visible:border-ring focus-visible:ring-3',
    'focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50',
    'dark:aria-invalid:ring-destructive/40',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        outline:
          'border-border hover:bg-foreground/10 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 gap-1 rounded-md px-2 text-xs',
        sm: 'h-7 gap-1 rounded-md px-2.5 text-[0.8rem]',
        md: 'h-8 gap-1.5 px-2.5',
        lg: 'h-9 gap-1.5 px-2.5',
        icon: 'size-8',
        'icon-xs': 'size-6 rounded-md',
        'icon-sm': 'size-7 rounded-md',
        'icon-lg': 'size-9',
      },
      shape: {
        square: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'square',
    },
  },
)

type CustomerVariant = VariantProps<typeof customerButtonVariants>['variant']
type AdminVariant = VariantProps<typeof adminButtonVariants>['variant']
type ButtonSize = VariantProps<typeof customerButtonVariants>['size']
type ButtonShape = VariantProps<typeof customerButtonVariants>['shape']

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'size'
> & {
  mode?: 'animated' | 'normal'
  variant?: CustomerVariant | AdminVariant
  size?: ButtonSize
  shape?: ButtonShape
  to?: string
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      mode = 'animated',
      variant,
      size,
      shape,
      className,
      to,
      asChild = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isAdmin = mode === 'normal'

    const cls = cn(
      isAdmin
        ? adminButtonVariants({
            variant: (variant ?? 'default') as AdminVariant,
            size,
            shape,
          })
        : customerButtonVariants({
            variant: (variant ?? 'solid') as CustomerVariant,
            size,
            shape,
          }),
      className,
    )

    const content = asChild ? children : (
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 sm:gap-2">
        {children}
      </span>
    )

    if (to) {
      return (
        <Link
          href={to}
          className={cls}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault()
              return
            }

            onClick?.(
              event as unknown as React.MouseEvent<HTMLButtonElement>,
            )
          }}
          {...(props as Omit<
            React.ComponentProps<typeof Link>,
            'href' | 'className' | 'children' | 'onClick'
          >)}
        >
          {content}
        </Link>
      )
    }

    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant ?? (isAdmin ? 'default' : 'solid')}
        data-size={size ?? 'md'}
        className={cls}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {content}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

// Keep existing imports working if your admin code uses CmsButton.
export const CmsButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'mode'>
>((props, ref) => <Button {...props} ref={ref} mode="normal" />)

CmsButton.displayName = 'CmsButton'

// Backward-compatible name for the animated variant configuration.
export const buttonVariants = customerButtonVariants
