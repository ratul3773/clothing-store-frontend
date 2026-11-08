"use client";

import * as React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Select from "@radix-ui/react-select";
import * as Radio from "@radix-ui/react-radio-group";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";

export function Check1({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label: string;
}) {
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
  );
}

export function Range({
  value,
  onChange,
  min,
  max,
  step = 100,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
}) {
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
          aria-label={i ? "Max price" : "Min price"}
          className="block h-5 w-5 rounded-full border-2 border-foreground bg-card transition-transform hover:scale-125 focus-visible:scale-125"
        />
      ))}
    </Slider.Root>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (b: boolean) => void;
  label?: string;
}) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      aria-label={label}
      className="relative h-6 w-11 shrink-0 rounded-full bg-foreground/25 transition-colors data-[state=checked]:bg-accent"
    >
      <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-card shadow transition-transform duration-300 data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
  );
}

export function Tip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
  );
}


export function Pick({
  value,
  onChange,
  options,
  className,
  label,
  id,
  disabled,
  onBlur,
  triggerRef,
  isAdmin = false,
  ...aria
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  className?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
  onBlur?: () => void;
  triggerRef?: React.Ref<HTMLButtonElement>;
  isAdmin?: boolean;
  "aria-invalid"?: boolean;
}) {
  return (
    <Select.Root
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <Select.Trigger
        id={id}
        ref={triggerRef}
        onBlur={onBlur}
        {...aria}
        aria-label={label}
        className={cn(
          "flex w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:ring-2 focus-visible:ring-ring/40",

          isAdmin
            ? [
                "rounded-md border border-border bg-background px-3",
                "text-foreground shadow-none",
                "hover:border-foreground/30",
                "data-[state=open]:border-foreground/40",
              ]
            : [
                "rounded-[3px] border border-foreground/50 bg-card px-4",
                "hover:border-accent",
              ],

          className,
        )}
      >
        <Select.Value
          placeholder={
            options.find((option) => !option.value)?.label
          }
        />

        <Select.Icon asChild>
          <ChevronDown
            size={isAdmin ? 14 : 16}
            className="shrink-0 text-muted-foreground"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={isAdmin ? 4 : 6}
          className={cn(
            "z-[120] min-w-[var(--radix-select-trigger-width)] overflow-hidden border bg-popover text-popover-foreground shadow-md",

            isAdmin
              ? "rounded-md border-border"
              : "rounded-[3px] border-foreground shadow-xl animate-[fadein_.2s_ease]",
          )}
        >
          <Select.Viewport className="p-1">
            {options
              .filter((option) => option.value)
              .map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-2 text-sm outline-none",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",

                    isAdmin
                      ? [
                          "rounded-sm",
                          "data-[highlighted]:bg-primary",
                          "data-[highlighted]:text-accent-foreground",
                        ]
                      : [
                          "rounded-[2px]",
                          "data-[highlighted]:bg-foreground",
                          "data-[highlighted]:text-background",
                        ],
                  )}
                >
                  <Select.ItemText>
                    {option.label}
                  </Select.ItemText>

                  <Select.ItemIndicator>
                    <Check
                      size={isAdmin ? 13 : 14}
                      className="shrink-0"
                    />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}


export function Choice({
  value,
  onChange,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; title: string; hint?: string }[];
  className?: string;
}) {
  return (
    <Radio.Root
      value={value}
      onValueChange={onChange}
      className={cn("grid gap-3", className)}
    >
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
            {o.hint && (
              <span className="block text-sm text-muted-foreground">
                {o.hint}
              </span>
            )}
          </span>
        </Radio.Item>
      ))}
    </Radio.Root>
  );
}

export function Menu({
  trigger,
  options,
}: {
  trigger: React.ReactNode;
  options: { href: string; icon: React.ReactNode; label: string }[];
}) {
  const { handleSignOut, isSigningOut } = useLogout();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-[120] min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto rounded-[3px] bg-card p-1 text-card-foreground shadow-xl animate-[fadein_.2s_ease]"
        >
          {/* {children} */}
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.href}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 text-sm outline-none data-[highlighted]:bg-foreground data-[highlighted]:text-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
              )}
              asChild
            >
              <Link href={option.href} className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </Link>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-background" />
          <DropdownMenu.Item
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 text-sm text-destructive outline-none data-[highlighted]:bg-destructive/5 data-[highlighted]:text- data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
            )}
            disabled={isSigningOut}
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-[2px] px-3 py-2 text-sm outline-none data-[highlighted]:bg-foreground data-[highlighted]:text-background data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}
