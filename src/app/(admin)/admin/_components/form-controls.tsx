"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Controller, type FieldPath, type FieldValues, type UseFormReturn } from "react-hook-form";

import { Field, Input, Select, Switch, Textarea } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

type BaseProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  className?: string;
};

function useFieldError<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: FieldPath<T>,
): string | undefined {
  const message = form.getFieldState(name, form.formState).error?.message;
  return typeof message === "string" ? message : undefined;
}

export function TextField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
  ...input
}: BaseProps<T> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "form" | "value" | "defaultValue">) {
  const error = useFieldError(form, name);
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Input
            {...input}
            name={field.name}
            ref={field.ref}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />
    </Field>
  );
}

export function TextareaField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
  ...textarea
}: BaseProps<T> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "form" | "value" | "defaultValue">) {
  const error = useFieldError(form, name);
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Textarea
            {...textarea}
            name={field.name}
            ref={field.ref}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={(event) => field.onChange(event.target.value)}
          />
        )}
      />
    </Field>
  );
}

export type SelectOption = { value: string; label: string; disabled?: boolean };

export function SelectField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
  options,
  placeholder,
  onValueChange,
  ...select
}: BaseProps<T> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "form" | "value" | "defaultValue"> & {
    options: SelectOption[];
    placeholder?: string;
    onValueChange?: (value: string) => void;
  }) {
  const error = useFieldError(form, name);
  return (
    <Field label={label} hint={hint} error={error} className={className}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            {...select}
            name={field.name}
            ref={field.ref}
            value={String(field.value ?? "")}
            onBlur={field.onBlur}
            onChange={(event) => {
              field.onChange(event.target.value);
              onValueChange?.(event.target.value);
            }}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      />
    </Field>
  );
}

export function SwitchField<T extends FieldValues>({
  form,
  name,
  label,
  hint,
  className,
  description,
}: BaseProps<T> & { description?: ReactNode }) {
  const error = useFieldError(form, name);
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Switch checked={Boolean(field.value)} onChange={field.onChange} label={label} />
        )}
      />
      {description && <span className="text-xs text-muted-foreground">{description}</span>}
      {hint && !description && <span className="text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
