
"use client";

import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Pick } from "../ui/controls";
import { Textarea } from "../ui/textarea";

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
  options?: { value: string; label: string }[];
  isSwitch?: boolean;
  isSelect?: boolean;
  isInput?: boolean;
  isTextArea?: boolean;
};
export function FormField<T extends FieldValues>({
  form,
  id,
  name,
  label,
  type = "text",
  description,
  startIcon: StartIcon,
  options,
  endAction,
  className,
  isSwitch,
  isSelect,
  isInput,
  isTextArea,
  ...inputProps
}: FormFieldProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("px-2", className)}>
          {!isSwitch && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

          <div className="relative">
            {StartIcon && (
              <StartIcon className={`pointer-events-none absolute left-3 ${isTextArea ? "top-4/14" : "top-1/2"} size-4 -translate-y-1/2 text-muted-foreground`} />
            )}
            {isSelect && options && (
              <Pick
                value={field.value}
                onChange={(v) => field.onChange(v)}
                label="Select Zone"
                options={options}
                className="w-full"
                aria-invalid={fieldState.invalid}
              />
            )}
            {isInput && 
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
            />}
            {isTextArea && (
              <Textarea
                {...field}
                id={id}
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder={inputProps.placeholder}
                className={cn(
                  StartIcon && "pl-10",
                  endAction && "pr-12",
                  className,
                )}
              />
            )}
            {isSwitch && (
              <Switch
                id={id}
                checked={field.value}
                onCheckedChange={field.onChange}
                label="Set as default address"
                aria-invalid={fieldState.invalid}
              />
            )}
            {endAction}
          </div>

          {description && (
            <FieldDescription>{description}</FieldDescription>
          )}

          {fieldState.error && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
}

export { Field, FieldDescription, FieldLabel };
