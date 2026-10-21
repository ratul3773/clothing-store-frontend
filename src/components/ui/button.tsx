// import * as React from "react"
// import { cva, type VariantProps } from "class-variance-authority"
// import { cn } from "cn"
// import { Slot } from "radix-ui"

// const buttonVariants = cva(
//   "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/80",
//         outline:
//           "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
//         secondary:
//           "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
//         ghost:
//           "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
//         destructive:
//           "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default:
//           "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
//         sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
//         lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
//         icon: "size-8",
//         "icon-xs":
//           "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
//         "icon-sm":
//           "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
//         "icon-lg": "size-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// function Button({
//   className,
//   variant = "default",
//   size = "default",
//   asChild = false,
//   ...props
// }: React.ComponentProps<"button"> &
//   VariantProps<typeof buttonVariants> & {
//     asChild?: boolean
//   }) {
//   const Comp = asChild ? Slot.Root : "button"

//   return (
//     <Comp
//       data-slot="button"
//       data-variant={variant}
//       data-size={size}
//       className={cn(buttonVariants({ variant, size, className }))}
//       {...props}
//     />
//   )
// }

// export { Button, buttonVariants }

'use client'

import * as React from 'react'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'group/btn relative inline-flex max-w-full shrink-0 cursor-pointer',
    'items-center justify-center gap-1.5 sm:gap-2',
    'overflow-hidden whitespace-nowrap',
    'font-semibold tracking-[0.04em] sm:tracking-[0.08em]',
    'transition-[color,transform,box-shadow] duration-300',
    'active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-40',
    'before:absolute before:inset-0 before:-z-0 before:translate-y-[101%]',
    'before:transition-transform before:duration-500',
    'before:ease-[cubic-bezier(.7,0,.2,1)]',
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
        sm: 'h-8 px-3 text-[0.65rem] sm:h-9 sm:px-4 sm:text-xs',
        md: 'h-10 px-4 text-[0.7rem] sm:h-11 sm:px-6 sm:text-xs',
        lg: 'h-12 px-5 text-xs sm:h-14 sm:px-8 sm:text-sm',
        icon: 'size-9 text-xs sm:size-10',
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

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    to?: string
  }

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant, size, shape, to, children, ...props }, ref) => {
    const cls = cn(buttonVariants({ variant, size, shape }), className)

    const inner = (
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5 sm:gap-2">
        {children}
      </span>
    )

    if (to) {
      return (
        <Link
          href={to}
          className={cls}
          aria-disabled={props.disabled}
          tabIndex={props.disabled ? -1 : undefined}
          onClick={props.disabled ? (event) => event.preventDefault() : undefined}
        >
          {inner}
        </Link>
      )
    }

    return (
      <button ref={ref} className={cls} {...props}>
        {inner}
      </button>
    )
  },
)

Button.displayName = 'Button'
