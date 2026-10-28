"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Badge, Btn, Card, CardHeader, Field, Input } from "@/components/cms/ui";

import { SIZE_PRESETS } from "../_constants/products.constants";
import {
  stockMatrixKey,
  type CreateColorDraft,
} from "../_types/products.types";

type Props = {
  colors: CreateColorDraft[];
  onColorsChange: (colors: CreateColorDraft[]) => void;
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
  stock: Record<string, string>;
  onStockChange: (stock: Record<string, string>) => void;
  threshold: string;
  onThresholdChange: (threshold: string) => void;
  errors?: {
    colors?: string;
    sizes?: string;
    variants?: string;
  };
};

const createKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c${Date.now()}${Math.random().toString(16).slice(2)}`;

export default function VariantsCreateSection({
  colors,
  onColorsChange,
  sizes,
  onSizesChange,
  stock,
  onStockChange,
  threshold,
  onThresholdChange,
  errors,
}: Props) {
  const [sizeInput, setSizeInput] = useState("");

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

  const setColor = (key: string, patch: Partial<CreateColorDraft>) => {
    onColorsChange(
      colors.map((color) => (color.key === key ? { ...color, ...patch } : color)),
    );
  };

  const setStock = (key: string, value: string) => {
    onStockChange({ ...stock, [key]: value });
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
              <Btn
                size="sm"
                onClick={() =>
                  onColorsChange([
                    ...colors,
                    { key: createKey(), name: "", hex: "" },
                  ])
                }
              >
                <Plus className="size-3.5" /> Add colour
              </Btn>
            </div>

            {colors.length === 0 ? (
              <p className="rounded border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                No colours yet. Add at least one colour before publishing.
              </p>
            ) : (
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div key={color.key} className="flex items-start gap-2">
                    <div
                      className="mt-1 size-6 shrink-0 rounded-full border border-border"
                      style={{ background: color.hex || "transparent" }}
                    />
                    <Input
                      value={color.name}
                      placeholder={`Colour ${index + 1} name`}
                      onChange={(event) =>
                        setColor(color.key, { name: event.target.value })
                      }
                      aria-label={`Colour ${index + 1} name`}
                    />
                    <Input
                      value={color.hex}
                      placeholder="#1F2937"
                      className="w-28 font-mono"
                      onChange={(event) =>
                        setColor(color.key, { hex: event.target.value })
                      }
                      aria-label={`Colour ${index + 1} hex`}
                    />
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : "#000000"}
                      onChange={(event) =>
                        setColor(color.key, { hex: event.target.value.toUpperCase() })
                      }
                      aria-label={`Choose colour ${index + 1}`}
                      className="mt-1 h-6 w-7 cursor-pointer rounded border border-border bg-card p-0"
                    />
                    <Btn
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove colour ${index + 1}`}
                      onClick={() =>
                        onColorsChange(
                          colors.filter((entry) => entry.key !== color.key),
                        )
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Btn>
                  </div>
                ))}
              </div>
            )}
            {errors?.colors && (
              <p className="mt-2 text-xs text-red-600">{errors.colors}</p>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Sizes
            </h4>
            <div className="flex gap-2">
              <Input
                value={sizeInput}
                placeholder="e.g. M"
                onChange={(event) => setSizeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addSize(sizeInput);
                  }
                }}
                aria-label="New size"
              />
              <Btn onClick={() => addSize(sizeInput)}>
                <Plus className="size-3.5" /> Add
              </Btn>
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
              <p className="mb-1 text-xs text-muted-foreground">Quick presets</p>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_PRESETS.map((preset) => (
                  <Btn
                    key={preset.label}
                    size="sm"
                    onClick={() => {
                      const merged = [...sizes];
                      for (const size of preset.sizes) {
                        if (
                          !merged.some(
                            (entry) => entry.toLowerCase() === size.toLowerCase(),
                          )
                        ) {
                          merged.push(size);
                        }
                      }
                      onSizesChange(merged);
                    }}
                  >
                    {preset.label}
                  </Btn>
                ))}
              </div>
            </div>
            {errors?.sizes && (
              <p className="mt-2 text-xs text-red-600">{errors.sizes}</p>
            )}

            <div className="mt-4">
              <Field
                label="Low stock threshold (all new variants)"
                hint="Variants at or below this count show as low stock."
              >
                <Input
                  value={threshold}
                  inputMode="numeric"
                  onChange={(event) => onThresholdChange(event.target.value)}
                />
              </Field>
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
                    <th key={size} className="px-2 py-2 text-center font-medium">
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
                    <tr key={color.key} className="border-b border-border last:border-0">
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
                          <Input
                            value={stock[stockMatrixKey(color.key, size)] ?? ""}
                            inputMode="numeric"
                            placeholder="0"
                            className="mx-auto h-7 w-16 text-center"
                            onChange={(event) =>
                              setStock(
                                stockMatrixKey(color.key, size),
                                event.target.value,
                              )
                            }
                            aria-label={`${color.name || "Colour"} ${size} opening stock`}
                          />
                        </td>
                      ))}
                      <td className="px-2 py-2 text-right tabular-nums">
                        {total > 0 ? (
                          <Badge tone="gray">{total}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {errors?.variants && (
            <p className="mt-2 text-xs text-red-600">{errors.variants}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
