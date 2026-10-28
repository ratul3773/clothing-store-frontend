import * as React from 'react'
import { cn } from '@/lib/utils'

const btnBase =
  'inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border px-3 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50'
const variants = {
  primary: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border-border bg-card text-foreground hover:bg-muted',
  ghost: 'border-transparent text-foreground hover:bg-muted',
  danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
  dangerOutline: 'border-red-200 bg-card text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10',
}
export type BtnVariant = keyof typeof variants

export const Btn = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' | 'icon' }>(
  ({ variant = 'outline', size = 'md', className, type = 'button', ...p }, ref) => (
    <button ref={ref} type={type} className={cn(btnBase, variants[variant], size === 'sm' && 'h-7 px-2 text-xs', size === 'icon' && 'w-8 px-0', className)} {...p} />
  ),
)
Btn.displayName = 'Btn'

export const cmsInput =
  'h-8 w-full rounded-md border border-border bg-card px-2.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-muted'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => <input ref={ref} className={cn(cmsInput, className)} {...p} />)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...p }, ref) => <textarea ref={ref} className={cn(cmsInput, 'h-auto min-h-20 py-2 leading-relaxed', className)} {...p} />,
)
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...p }, ref) => <select ref={ref} className={cn(cmsInput, 'pr-6', className)} {...p} />,
)
Select.displayName = 'Select'

export function Field({ label, hint, error, children, className }: { label: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1 block text-xs font-medium text-foreground/80">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-5 w-9 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-border')}
      >
        <span className={cn('absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')} />
      </button>
      {label}
    </label>
  )
}

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('rounded-lg border border-border bg-card', className)} {...p} />

export function CardHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}

export function PageHeader({ title, description, actions, crumbs }: { title: string; description?: string; actions?: React.ReactNode; crumbs?: string[] }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {crumbs && <p className="mb-1 text-xs text-muted-foreground">{crumbs.join(' / ')}</p>}
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function StatCard({ label, value, hint, tone }: { label: string; value: React.ReactNode; hint?: React.ReactNode; tone?: 'good' | 'bad' }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint && <p className={cn('mt-1 text-xs text-muted-foreground', tone === 'good' && 'text-emerald-600', tone === 'bad' && 'text-red-600')}>{hint}</p>}
    </Card>
  )
}

const tones = {
  gray: 'bg-muted text-foreground/70',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  violet: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
}
export type Tone = keyof typeof tones
export const Badge = ({ tone = 'gray', className, ...p }: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) => (
  <span className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium', tones[tone], className)} {...p} />
)

export const Toolbar = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-wrap items-center gap-2 border-b border-border p-3', className)} {...p} />

export function Empty({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-12 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
