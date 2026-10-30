"use client";

import { Controller, type FieldPath, type FieldValues, type UseFormReturn } from "react-hook-form";

import { Badge, Field } from "@/components/cms/ui";
import { cn } from "@/lib/utils";
import type { Badge as BadgeValue } from "@/redux/apis/types/product.types";

import { BADGE_OPTIONS, BADGE_TONES } from "../_constants/products.constants";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
};

export default function BadgesField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
}: Props<T>) {
  const error = form.getFieldState(name, form.formState).error?.message;

  return (
    <Field
      label={label}
      hint={hint}
      error={typeof error === "string" ? error : undefined}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => {
          const selected = (field.value ?? []) as BadgeValue[];
          const toggle = (badge: BadgeValue) => {
            field.onChange(
              selected.includes(badge)
                ? selected.filter((value) => value !== badge)
                : [...selected, badge],
            );
          };

          return (
            <div className="flex flex-wrap gap-1.5">
              {BADGE_OPTIONS.map((option) => {
                const badge = option.value as BadgeValue;
                const active = selected.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(badge)}
                    className={cn(
                      "rounded border px-2 py-1 text-[11px] font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
              {selected.length > 0 && (
                <span className="ml-1 flex items-center gap-1">
                  {selected.map((badge) => (
                    <Badge key={badge} tone={BADGE_TONES[badge]}>
                      {badge.replaceAll("_", " ")}
                    </Badge>
                  ))}
                </span>
              )}
            </div>
          );
        }}
      />
    </Field>
  );
}
