"use client";

import { CmsButton } from "@/components/ui/button";
import {
  useFieldArray,
  useWatch,
  type UseFormReturn,
  type FieldArrayWithId,
} from "react-hook-form";
import { FormField } from "@/components/common/form-field";

import { bdt } from "@/lib/utils";
import type { PublicProduct } from "@/redux/apis/types/product.types";
import type { ManualOrderFormValues } from "../_schemas/manual-order.schema";

export default function ManualOrderLines({
  form,
  catalogs,
  fields,
  remove,
  disabled,
}: {
  form: UseFormReturn<ManualOrderFormValues>;
  catalogs: Record<string, PublicProduct>;
  fields: FieldArrayWithId<ManualOrderFormValues, "lines">[];
  remove: (index: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <LineFields
          key={field.id}
          form={form}
          index={index}
          product={catalogs[field.catalogId]}
          disabled={disabled}
          onRemove={() => remove(index)}
        />
      ))}
      {form.formState.errors.lines?.message && (
        <p role="alert" className="text-destructive">
          {form.formState.errors.lines.message}
        </p>
      )}
    </div>
  );
}

function LineFields({
  form,
  index,
  product,
  disabled,
  onRemove,
}: {
  form: UseFormReturn<ManualOrderFormValues>;
  index: number;
  product: PublicProduct;
  disabled: boolean;
  onRemove: () => void;
}) {
  const array = useFieldArray({
    control: form.control,
    name: `lines.${index}.selections`,
    keyName: "fieldId",
  });
  const current = useWatch({ control: form.control, name: `lines.${index}` });
  return (
    <div className="space-y-3 rounded border border-border p-4">
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-semibold">
            {current.name}
            {current.type === "COMBO" ? " · Combo" : ""}
          </p>
          {product && (
            <p className="text-xs text-muted-foreground">
              Current catalog price: {bdt(product.effectivePrice)}
            </p>
          )}
        </div>
        <CmsButton variant="outline" disabled={disabled} onClick={onRemove}>
          Remove
        </CmsButton>
      </div>
      {product?.type === "PRODUCT" && (
        <FormField
          form={form}
          id={`manual-line-${index}-variant`}
          name={`lines.${index}.variantId`}
          label="Colour / size"
          isSelect
          disabled={disabled}
          options={[
            { value: "", label: "Choose a variant" },
            ...product.variants.map((variant) => ({
              value: variant.id,
              label: `${variant.colorName} / ${variant.size} (${variant.available} available)`,
              disabled: !variant.inStock,
            })),
          ]}
        />
      )}
      {product?.type === "COMBO" &&
        array.fields.map((field, componentIndex) => {
          const component = product.items.find(
            (item) => item.id === field.comboItemId,
          );
          return (
            component && (
              <FormField
                key={field.fieldId}
                form={form}
                id={`manual-line-${index}-component-${componentIndex}`}
                name={`lines.${index}.selections.${componentIndex}.variantId`}
                label={`${component.product.name} · ${component.color.name} × ${component.quantity} — size`}
                isSelect
                disabled={disabled}
                options={[
                  { value: "", label: "Choose a size" },
                  ...component.variants.map((variant) => ({
                    value: variant.id,
                    label: `${variant.size} (${variant.available} pieces available)`,
                    disabled: variant.available < component.quantity,
                  })),
                ]}
              />
            )
          );
        })}
      <FormField
        form={form}
        id={`manual-line-${index}-quantity`}
        name={`lines.${index}.quantity`}
        label={current.type === "COMBO" ? "Number of combos" : "Quantity"}
        isInput
        type="number"
        min={1}
        max={50}
        disabled={disabled}
      />
    </div>
  );
}
