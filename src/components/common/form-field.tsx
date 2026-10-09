import type { LucideIcon } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "name" | "type" | "value" | "defaultValue" | "onChange"
> & {
  id: string;
  label: React.ReactNode;
  name?: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  defaultValue?: string;
  description?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  startIcon?: LucideIcon;
  endAction?: React.ReactNode;
};

export function FormField({
  id,
  label,
  name,
  type = "text",
  value,
  defaultValue,
  placeholder,
  description,
  required,
  disabled,
  inputMode,
  onChange,
  startIcon: StartIcon,
  endAction,
  className,
  ...inputProps
}: FormFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        {StartIcon && (
          <StartIcon className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
        )}
        <Input
          id={id}
          name={name ?? id}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          {...inputProps}
          className={cn(StartIcon && "pl-10 mx-auto", className)}
        />
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

export { Field, FieldDescription, FieldLabel };