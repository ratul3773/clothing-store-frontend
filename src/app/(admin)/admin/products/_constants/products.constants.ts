import type { Tone } from "@/components/cms/ui";
import type {
  AdminProductSort,
  Badge,
  Fit,
  ProductStatus,
  StockAdjustmentType,
} from "@/redux/apis/types/product.types";

export const PAGE_SIZE = 20;
export const MAX_IMAGES = 8;
export { IMAGE_ACCEPT, MAX_IMAGE_BYTES } from "@/lib/image";
export const DEFAULT_LOW_STOCK = "3";

export const PRODUCT_BADGES = [
  "NEW",
  "SALE",
  "BEST_SELLER",
  "LIMITED",
  "COMBO",
] as const satisfies readonly Badge[];

export const PRODUCT_FITS = [
  "slim",
  "regular",
  "relaxed",
  "oversized",
] as const satisfies readonly Fit[];

export const PRODUCT_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "ARCHIVED",
] as const satisfies readonly ProductStatus[];

export const STOCK_ADJUSTMENT_TYPES = [
  "RESTOCK",
  "ADJUSTMENT",
  "DAMAGED",
  "STOCKTAKE",
] as const satisfies readonly StockAdjustmentType[];

export const ADMIN_PRODUCT_SORTS = [
  "newest",
  "updated_desc",
  "name_asc",
  "name_desc",
  "price_asc",
  "price_desc",
] as const satisfies readonly AdminProductSort[];

export const badgeLabel = (badge: string) => badge.replaceAll("_", " ");

export const BADGE_OPTIONS = PRODUCT_BADGES.map((badge) => ({
  value: badge,
  label: badgeLabel(badge),
}));

export const BADGE_TONES: Record<Badge, Tone> = {
  NEW: "blue",
  SALE: "red",
  BEST_SELLER: "green",
  LIMITED: "violet",
  COMBO: "amber",
};

export const FIT_OPTIONS = [
  { value: "", label: "Not specified" },
  ...PRODUCT_FITS.map((fit) => ({ value: fit, label: fit })),
];

export const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "ARCHIVED", label: "Archived" },
];

export const STATUS_TONES: Record<ProductStatus, Tone> = {
  DRAFT: "gray",
  ACTIVE: "green",
  ARCHIVED: "amber",
};

export const SORT_OPTIONS = [
  { value: "updated_desc", label: "Recently updated" },
  { value: "newest", label: "Newest" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "price_asc", label: "Price low → high" },
  { value: "price_desc", label: "Price high → low" },
];

export const STOCK_TYPE_OPTIONS = [
  { value: "RESTOCK", label: "Restock (add stock)" },
  { value: "ADJUSTMENT", label: "Adjustment (signed change)" },
  { value: "DAMAGED", label: "Damaged (remove stock)" },
  { value: "STOCKTAKE", label: "Stocktake (set counted stock)" },
];

export const SIZE_PRESETS = [
  { label: "Shirt", sizes: ["S", "M", "L", "XL", "XXL"] },
  { label: "Pant", sizes: ["30", "32", "34", "36", "38"] },
] as const;
