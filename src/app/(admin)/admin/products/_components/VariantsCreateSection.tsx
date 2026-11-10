"use client";
import { CmsButton } from "@/components/ui/button";
import { useWatch } from "react-hook-form";

import { FormField } from "@/components/common/form-field";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { ProductDraftFormValues } from "../_schemas/product.schema";

import { Badge, Card, CardHeader } from "@/components/cms/ui";

import { SIZE_PRESETS } from "../_constants/products.constants";
import {
  stockMatrixKey
} from "../_types/products.types";

type Props = { form: UseFormReturn<ProductDraftFormValues> };

const createKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c${Date.now()}${Math.random().toString(16).slice(2)}`;

export default function VariantsCreateSection({ form }: Props) {
  const { colors, sizes, stock, sizeInput } = useWatch({ control: form.control, compute: (values) => values });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "colors" });
  const setSizeInput = (value: string) => form.setValue("sizeInput", value);
  const onSizesChange = (value: string[]) => form.setValue("sizes", value, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
  const errors = form.formState.errors;
  const addSize = (raw: string) => {
    const size = raw.trim();
    if (!size) return;
    if (sizes.some((entry) => entry.toLowerCase() === size.toLowerCase())) {
      setSizeInput("");
      return;
    }
    onSizesChange([...sizes, size]);
    setSizeInput("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title="Colours & sizes"
          description="A variant is created for every colour / size combination. Images can be attached after the draft is created."
        />
        <div className="grid gap-5 p-4 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Colours
              </h4>
              <CmsButton variant="outline"
                size="sm"
                onClick={() =>
                  append({ key: createKey(), name: "", hex: "" })
                }
              >
                <Plus className="size-3.5" /> Add colour
              </CmsButton>
            </div>

            {colors.length === 0 ? (
              <p className="rounded border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                No colours yet. Add at least one colour before publishing.
              </p>
            ) : (
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={fields[index].id} className="flex items-start gap-2">
                    <div
                      className="mt-1 size-6 shrink-0 rounded-full border border-border"
                      style={{ background: color.hex || "transparent" }}
                    />
                    <FormField form={form} id={`colors.${index}.name`} name={`colors.${index}.name`} label={`Colour ${index + 1} name`} isAdmin isInput placeholder={`Colour ${index + 1} name`} />
                    <FormField form={form} id={`colors.${index}.hex`} name={`colors.${index}.hex`} label={`Colour ${index + 1} hex`} isAdmin isInput placeholder="#1F2937" className="w-28 font-mono" />
                    <input
                      type="color"
                      value={
                        /^#[0-9a-fA-F]{6}$/.test(color.hex)
                          ? color.hex
                          : "#000000"
                      }
                      onChange={(event) =>
                        form.setValue(`colors.${index}.hex`, event.target.value.toUpperCase(), { shouldDirty: true, shouldValidate: form.formState.isSubmitted })
                      }
                      aria-label={`Choose colour ${index + 1}`}
                      className="mt-1 h-6 w-7 cursor-pointer rounded border border-border bg-card p-0"
                    />
                    <CmsButton
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove colour ${index + 1}`}
                      onClick={() =>
                        remove(index)
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </CmsButton>
                  </div>
                ))}
              </div>
            )}
            {errors?.colors && (
              <p className="mt-2 text-xs text-red-600">{errors.colors.root?.message ?? errors.colors.message}</p>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sizes
            </h4>
            <div className="flex gap-2">
              <FormField form={form} id={"sizeInput"} name={"sizeInput"} label="New size" isAdmin isInput placeholder="e.g. M" onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addSize(sizeInput);
                }
              }} />
              <CmsButton variant="outline" onClick={() => addSize(sizeInput)}>
                <Plus className="size-3.5" /> Add
              </CmsButton>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs"
                >
                  {size}
                  <button
                    type="button"
                    aria-label={`Remove size ${size}`}
                    onClick={() =>
                      onSizesChange(sizes.filter((entry) => entry !== size))
                    }
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </span>
              ))}
              {sizes.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  No sizes yet.
                </span>
              )}
            </div>

            <div className="mt-3">
              <p className="mb-1 text-xs text-muted-foreground">
                Quick presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_PRESETS.map((preset) => (
                  <CmsButton variant="outline"
                    key={preset.label}
                    size="sm"
                    onClick={() => {
                      const merged = [...sizes];
                      for (const size of preset.sizes) {
                        if (
                          !merged.some(
                            (entry) =>
                              entry.toLowerCase() === size.toLowerCase(),
                          )
                        ) {
                          merged.push(size);
                        }
                      }
                      onSizesChange(merged);
                    }}
                  >
                    {preset.label}
                  </CmsButton>
                ))}
              </div>
            </div>
            {errors?.sizes && (
              <p className="mt-2 text-xs text-red-600">{errors.sizes.message}</p>
            )}

            <div className="mt-4">
              <FormField form={form} id={"threshold"} name={"threshold"} label="Low stock threshold (all new variants)" isAdmin isInput inputMode="numeric" />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Opening stock"
          description="Leave cells empty for zero. Stock can be adjusted later."
        />
        <div className="overflow-x-auto p-4">
          {colors.length === 0 || sizes.length === 0 ? (
            <p className="rounded border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              Add at least one colour and one size to build the stock matrix.
            </p>
          ) : (
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Colour</th>
                  {sizes.map((size) => (
                    <th
                      key={size}
                      className="px-2 py-2 text-center font-medium"
                    >
                      {size}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {colors.map((color) => {
                  const total = sizes.reduce((sum, size) => {
                    const value = Number(
                      stock[stockMatrixKey(color.key, size)] ?? 0,
                    );
                    return sum + (Number.isFinite(value) ? value : 0);
                  }, 0);

                  return (
                    <tr
                      key={color.key}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-2 py-2">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-3 rounded-full border border-border"
                            style={{ background: color.hex || "transparent" }}
                          />
                          {color.name || "Untitled colour"}
                        </span>
                      </td>
                      {sizes.map((size) => (
                        <td key={size} className="px-2 py-2 text-center">
                          <FormField form={form} id={`stock.${stockMatrixKey(color.key, size)}`} name={`stock.${stockMatrixKey(color.key, size)}`} label={`${color.name || "Colour"} ${size} opening stock`} isAdmin isInput inputMode="numeric" placeholder="0" className="mx-auto w-16 text-center [&_[data-slot=field-label]]:sr-only [&_input]:h-7" />
                        </td>
                      ))}
                      <td className="px-2 py-2 text-right tabular-nums">
                        {total > 0 ? (
                          <Badge tone="gray">{total}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            0
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
