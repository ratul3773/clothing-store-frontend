'use client'

import * as React from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Slider from '@radix-ui/react-slider'
import * as Switch from '@radix-ui/react-switch'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as Select from '@radix-ui/react-select'
import * as Radio from '@radix-ui/react-radio-group'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Check1({ checked, onChange, label }: { checked: boolean; onChange: (b: boolean) => void; label: string }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="grid h-5 w-5 place-items-center rounded-[2px] border border-foreground/60 bg-card transition group-hover:border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent"
      >
        <Checkbox.Indicator className="text-accent-foreground">
          <Check size={14} strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  )
}

export function Range({ value, onChange, min, max, step = 100 }: { value: [number, number]; onChange: (v: [number, number]) => void; min: number; max: number; step?: number }) {
  return (
    <Slider.Root
      className="relative flex h-6 w-full touch-none items-center"
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={(v) => onChange([v[0], v[1]])}
    >
      <Slider.Track className="relative h-[3px] grow bg-foreground/20">
        <Slider.Range className="absolute h-full bg-accent" />
      </Slider.Track>
      {[0, 1].map((i) => (
        <Slider.Thumb
          key={i}
          aria-label={i ? 'Max price' : 'Min price'}
          className="block h-5 w-5 rounded-full border-2 border-foreground bg-card transition-transform hover:scale-125 focus-visible:scale-125"
        />
      ))}
    </Slider.Root>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (b: boolean) => void; label?: string }) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
      className="relative h-6 w-11 shrink-0 rounded-full bg-foreground/25 transition-colors data-[state=checked]:bg-accent"
    >
      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-card shadow transition-transform duration-300 data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
  )
}

export function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={120}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="label-mono z-[120] rounded-[2px] bg-foreground px-2.5 py-1.5 text-background animate-[fadein_.2s_ease]"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export function Pick({ value, onChange, options, className, label }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string; label: string }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        aria-label={label}
        className={cn(
          'flex h-11 items-center justify-between gap-3 rounded-[3px] border border-foreground/50 bg-card px-4 text-sm transition hover:border-accent',
          className,
        )}
      >                                                          
        <Select.Value />
        <Select.Icon>
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[120] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[3px] border border-foreground bg-card shadow-xl animate-[fadein_.2s_ease]"
        >
          <Select.Viewport className="p-1">
            {options.map((o) => (
              <Select.Item
                key={o.value}
                value={o.value}
                className="flex cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 text-sm outline-none data-[highlighted]:bg-foreground data-[highlighted]:text-background"
              >
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export function Choice({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: { value: string; title: string; hint?: string }[]; className?: string }) {
  return (
    <Radio.Root value={value} onValueChange={onChange} className={cn('grid gap-3', className)}>
      {options.map((o) => (
        <Radio.Item
          key={o.value}
          value={o.value}
          className="group relative flex items-center gap-4 rounded-[3px] border border-foreground/30 bg-card p-4 text-left transition hover:border-foreground data-[state=checked]:border-accent data-[state=checked]:bg-accent/10"
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-foreground/60 group-data-[state=checked]:border-accent">
            <Radio.Indicator className="h-2.5 w-2.5 animate-[pop_.3s_ease] rounded-full bg-accent" />
          </span>
          <span>
            <span className="block font-semibold">{o.title}</span>
            {o.hint && <span className="block text-sm text-muted-foreground">{o.hint}</span>}
          </span>
        </Radio.Item>
      ))}
    </Radio.Root>
  )
}
