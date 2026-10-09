"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 5,
  label,
  size = "md",
  className,
}: QuantityStepperProps) {
  const h = size === "sm" ? "h-9" : "h-11";
  const w = size === "sm" ? "w-9" : "w-11";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-md border border-input bg-card",
        h,
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn("h-full rounded-l-md rounded-r-none", w)}
      >
        <Minus data-icon="inline-start" />
      </Button>
      <output
        aria-live="polite"
        className="w-8 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </output>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn("h-full rounded-l-none rounded-r-md", w)}
      >
        <Plus data-icon="inline-start" />
      </Button>
    </div>
  );
}
