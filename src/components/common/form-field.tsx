
"use client";

import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormFieldProps<T extends FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "type" | "value" | "defaultValue" | "onChange"|"form"
> & {
  form: UseFormReturn<T>;
  id: string;
  name: FieldPath<T>;
  label: ReactNode;
  type?: React.HTMLInputTypeAttribute;
  description?: ReactNode;
  startIcon?: LucideIcon;
  endAction?: ReactNode;
};

export function FormField<T extends FieldValues>({
  form,
  id,
  name,
  label,
  type = "text",
  description,
  startIcon: StartIcon,
  endAction,
  className,
  ...inputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("px-2", className)}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>

          <div className="relative">
            {StartIcon && (
              <StartIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            )}

            <Input
              {...field}
              {...inputProps}
              id={id}
              type={type}
              value={field.value ?? ""}
              aria-invalid={fieldState.invalid}
              className={cn(
                StartIcon && "pl-10",
                endAction && "pr-12",
                "h-10",
                className,
              )}
            />

            {endAction}
          </div>

          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {fieldState.error && (
            <FieldDescription className="text-destructive">
              {fieldState.error.message}
            </FieldDescription>
          )}
        </Field>
      )}
    />
  );
}

export { Field, FieldDescription, FieldLabel };
