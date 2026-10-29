import type { Tone } from "@/components/cms/ui";
import type {
  AdminProduct,
  AdminVariant,
  Badge,
  Fit,
  OfferState,
  ProductStatus,
} from "@/redux/apis/types/product.types";

import { STATUS_TONES } from "../_constants/products.constants";
import type { ProductCoreFormValues } from "../_schemas/product.schema";

/* --------------------------------------------------------------- conversions */

export const toNumber = (value: string) => {
  const trimmed = value.trim();
  return trimmed === "" ? Number.NaN : Number(trimmed);
};

export const parseOptionalInt = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const parseOptionalId = (value: string): string | undefined =>
  value.trim() === "" ? undefined : value.trim();

export const nullableText = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

/** Removes empty filter values before they reach the query string. */
export function cleanParams<T extends Record<string, unknown>>(
  params: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;
}

/* ------------------------------------------------------------------ payloads */

export type ProductCorePayload = {
  name: string;
  code: string;
  description: string | null;
  material: string | null;
  fit: Fit | null;
  careInstructions: string | null;
  categoryId: string;
  regularPrice: number;
  badges: Badge[];
  isExchangeEligible: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function toCorePayload(values: ProductCoreFormValues): ProductCorePayload {
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    description: nullableText(values.description),
    material: nullableText(values.material),
    fit: values.fit === "" ? null : values.fit,
    careInstructions: nullableText(values.careInstructions),
    categoryId: values.categoryId,
    regularPrice: Number(values.regularPrice),
    badges: values.badges,
    isExchangeEligible: values.isExchangeEligible,
    seoTitle: nullableText(values.seoTitle),
    seoDescription: nullableText(values.seoDescription),
  };
}

export function toCoreFormValues(product: AdminProduct): ProductCoreFormValues {
  return {
    name: product.name,
    code: product.code ?? "",
    parentCategoryId: product.category.parentId ?? "",
    categoryId: product.category.id,
    regularPrice: String(product.regularPrice),
    description: product.description ?? "",
    material: product.material ?? "",
    fit: product.fit ?? "",
    careInstructions: product.careInstructions ?? "",
    badges: product.badges,
    isExchangeEligible: product.isExchangeEligible,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
  };
}

/* --------------------------------------------------------------------- dates */

export function formatDateTimeInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function dateInputToISO(value: string): string | undefined {
  if (value.trim() === "") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function dateInputToISOOrNull(value: string): string | null {
  return dateInputToISO(value) ?? null;
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* --------------------------------------------------------------------- stock */

export type StockState = "ok" | "low" | "out";

export function variantStockState(variant: AdminVariant): StockState {
  if (!variant.isActive) return "out";
  if (variant.available <= 0) return "out";
  if (variant.available <= variant.lowStockThreshold) return "low";
  return "ok";
}

export function productStockState(
  product: Pick<AdminProduct, "totalOnHand" | "variants">,
): StockState {
  if (product.totalOnHand <= 0) return "out";
  if (product.variants.some((variant) => variantStockState(variant) === "low")) {
    return "low";
  }
  return "ok";
}

/* -------------------------------------------------------------------- status */

export const statusTone = (status: ProductStatus): Tone => STATUS_TONES[status];

export const statusLabel = (status: ProductStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

export function offerStateTone(state: OfferState): Tone {
  switch (state) {
    case "ACTIVE":
      return "green";
    case "SCHEDULED":
      return "blue";
    case "EXPIRED":
      return "amber";
    default:
      return "gray";
  }
}

/* -------------------------------------------------------------------- images */

export { validateImageFile } from "@/lib/image";

/* --------------------------------------------------------------------- misc */

export function arrayMove<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item === undefined) return items;
  next.splice(to, 0, item);
  return next;
}

export function variantName(variant: Pick<AdminVariant, "colorName" | "size">) {
  return `${variant.colorName} / ${variant.size}`;
}

export function slugPreview(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
