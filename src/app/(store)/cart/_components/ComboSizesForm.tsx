"use client";

import { useForm } from "react-hook-form";
import type { ComboCartItem } from "@/redux/apis/types/cart.types";
import type { ComboSelection } from "@/redux/apis/types/combo.types";
import { Button } from "@/components/ui/button";

export default function ComboSizesForm({ item, disabled, onSave }: {
  item: ComboCartItem;
  disabled: boolean;
  onSave: (id: string, selections: ComboSelection[]) => Promise<boolean>;
}) {
  const components = item.combo?.items ?? [];
  const form = useForm<{ choices: Array<{ variantId: string }> }>({
    defaultValues: { choices: components.map((component) => {
      const saved = item.selections.find((selection) => selection.comboItemId === component.id);
      return { variantId: component.variants.some((variant) => variant.id === saved?.variantId) ? saved!.variantId : "" };
    }) },
  });
  return <details className="text-xs" open={item.requiresSelection || undefined}>
    <summary className="cursor-pointer font-medium underline">{item.requiresSelection ? "Choose sizes" : "Change sizes"}</summary>
    <form className="mt-2 space-y-2" onSubmit={form.handleSubmit(async ({ choices }) => {
      const saved = await onSave(item.id, choices.map((choice, index) => ({ comboItemId: components[index].id, variantId: choice.variantId })));
      if (saved) form.reset({ choices });
    })}>
      <fieldset disabled={disabled || form.formState.isSubmitting} className="space-y-2">
        {components.map((component, index) => <label key={component.id} className="block">
          <span className="mb-1 block">Size for {component.product.name} - {component.color.name} (all {component.quantity} pieces per combo)</span>
          <select className="w-full rounded border border-border bg-background p-2" {...form.register(`choices.${index}.variantId`, { required: "Choose a size." })} aria-invalid={!!form.formState.errors.choices?.[index]?.variantId}>
            <option value="">Choose size</option>
            {component.variants.map((variant) => <option key={variant.id} value={variant.id} disabled={variant.maxQuantity < item.quantity}>{variant.size}{variant.maxQuantity < item.quantity ? " (not enough stock)" : ""}</option>)}
          </select>
          {form.formState.errors.choices?.[index]?.variantId && <span role="alert" className="text-destructive">Choose a size.</span>}
        </label>)}
        <p>Sizes apply to all {item.quantity} combo units. Matching configurations are combined.</p>
        <Button type="submit" size="sm" disabled={!form.formState.isDirty}>Save sizes</Button>
      </fieldset>
    </form>
  </details>;
}
