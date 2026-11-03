"use client";

import Image from "next/image";
import { Controller, useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { Btn, Field, Input } from "@/components/cms/ui";
import { bdt } from "@/lib/utils";
import type { ComboDraft } from "../_utils/combo.utils";
import ComboColorPicker from "./ComboColorPicker";

export default function ComboItemsList({ form, busy }: { form: UseFormReturn<ComboDraft>; busy: boolean }) {
  const items = useWatch({ control: form.control, name: "items", defaultValue: form.getValues("items") });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const pieces = items.reduce((sum, item) => sum + (Number.isFinite(item.quantity) ? item.quantity : 0), 0);
  const error = form.formState.errors.items?.message ?? form.formState.errors.items?.root?.message;
  return <>
    <h3 className="text-sm font-semibold">Selected pieces ({pieces} / 3)</h3>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!items.length && <p className="text-sm text-muted-foreground">Select products and colors below. Sizes are chosen by the customer. A combo needs two or three physical pieces.</p>}
    <ul className="space-y-3">{fields.map((item, index) => <li key={item.id} className="flex flex-wrap items-center gap-3 rounded border border-border p-2">
      <Image src={item.product.imageUrl ?? "/product-placeholder.svg"} alt="" width={40} height={50} className="h-12 w-10 object-cover" />
      <span className="min-w-0 flex-1 text-sm">{item.product.name}<span className="block text-xs text-muted-foreground">{item.color.name} / {bdt(item.product.unitPrice)} each</span></span>
      <Controller control={form.control} name={`items.${index}.quantity`} render={({ field, fieldState }) => <Field label={`Quantity of ${item.product.name} ${item.color.name}`} error={fieldState.error?.message}>
        <Input {...field} value={Number.isFinite(field.value) ? field.value : ""} type="number" className="w-20" min={1} max={3} aria-invalid={!!fieldState.error} onChange={(event) => field.onChange(event.target.valueAsNumber)} />
      </Field>} />
      <Btn aria-label={`Remove ${item.product.name} ${item.color.name}`} onClick={() => remove(index)}>Remove</Btn>
    </li>)}</ul>
    <ComboColorPicker disabled={busy || pieces >= 3} onAdd={(item) => {
      const current = form.getValues("items");
      const index = current.findIndex((entry) => entry.colorId === item.colorId);
      if (index < 0) append(item);
      else form.setValue(`items.${index}.quantity`, current[index].quantity + item.quantity, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
    }} />
  </>;
}
