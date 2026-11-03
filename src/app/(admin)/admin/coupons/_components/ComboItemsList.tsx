"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useWatch, type UseFormReturn } from "react-hook-form";
import { Badge, Btn, Field, Input } from "@/components/cms/ui";
import { bdt } from "@/lib/utils";
import type { ComboDraft } from "../_utils/combo.utils";
import ComboColorPicker from "./ComboColorPicker";

export default function ComboItemsList({ form, busy }: { form: UseFormReturn<ComboDraft>; busy: boolean }) {
  const items = useWatch({ control: form.control, name: "items", defaultValue: form.getValues("items") });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const pieces = items.reduce((sum, item) => sum + (Number.isFinite(item.quantity) ? item.quantity : 0), 0);
  const error = form.formState.errors.items?.message ?? form.formState.errors.items?.root?.message;
  return <>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold">Your combo</h3>
      <Badge tone={pieces >= 2 && pieces <= 3 ? "green" : "gray"}>{pieces} / 3 pieces selected</Badge>
    </div>
    <p role="status" className="text-xs text-muted-foreground">{pieces >= 3 ? "Your combo is full. Remove a piece to choose something else." : pieces === 2 ? "Ready to save, or add one more piece." : `Add ${2 - pieces} more ${pieces === 1 ? "piece" : "pieces"} to complete your combo.`}</p>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    {!items.length && <p className="text-sm text-muted-foreground">Select products and colors below. Sizes are chosen by the customer. A combo needs two or three physical pieces.</p>}
    <ul className="space-y-3 [&_button]:transition-none">{fields.map((item, index) => <li key={item.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
      <Image src={item.product.imageUrl ?? "/product-placeholder.svg"} alt={item.product.name} width={64} height={80} className="h-20 w-16 rounded-md object-cover" />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium">{item.product.name}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className="size-3 rounded-full border border-foreground/20 bg-muted" style={{ backgroundColor: item.color.hex ?? undefined }} />{item.color.name}</p>
        <p className="text-xs text-muted-foreground">{bdt(item.product.unitPrice)} each</p>
        <p className="text-sm font-semibold">{bdt(item.product.unitPrice * (Number.isFinite(items[index]?.quantity) ? items[index].quantity : 0))}</p>
      </div>
      <Controller control={form.control} name={`items.${index}.quantity`} render={({ field, fieldState }) => {
        const maxStock = Math.max(0, ...item.variants.map((variant) => variant.available));
        const maxQuantity = Math.min(3, 3 - pieces + (Number.isFinite(field.value) ? field.value : 0), maxStock);
        return <div className="space-y-1">
          <div className="flex items-end gap-1">
            <Btn size="icon" disabled={busy || !Number.isFinite(field.value) || field.value <= 1} aria-label={`Decrease quantity of ${item.product.name} ${item.color.name}`} onClick={() => field.onChange(field.value - 1)}><Minus className="size-3.5" /></Btn>
            <Field label="Quantity" error={fieldState.error?.message}>
              <Input {...field} aria-label={`Quantity of ${item.product.name} ${item.color.name}`} value={Number.isFinite(field.value) ? field.value : ""} type="number" className="w-16 text-center" min={1} max={Math.max(1, maxQuantity)} aria-invalid={!!fieldState.error} onChange={(event) => field.onChange(event.target.valueAsNumber)} />
            </Field>
            <Btn size="icon" disabled={busy || !Number.isFinite(field.value) || field.value >= maxQuantity} aria-label={`Increase quantity of ${item.product.name} ${item.color.name}`} onClick={() => field.onChange(field.value + 1)}><Plus className="size-3.5" /></Btn>
          </div>
        </div>;
      }} />
      <Btn variant="ghost" size="icon" disabled={busy} aria-label={`Remove ${item.product.name} ${item.color.name}`} onClick={() => remove(index)}><Trash2 className="size-4 text-destructive" /></Btn>
    </li>)}</ul>
    <ComboColorPicker selectedItems={items} disabled={busy || pieces >= 3} onAdd={(item) => {
      const current = form.getValues("items");
      if (busy || current.reduce((sum, entry) => sum + (Number.isFinite(entry.quantity) ? entry.quantity : 0), 0) >= 3) return;
      const index = current.findIndex((entry) => entry.colorId === item.colorId);
      if (index < 0) append(item);
      else form.setValue(`items.${index}.quantity`, current[index].quantity + item.quantity, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
    }} />
  </>;
}
