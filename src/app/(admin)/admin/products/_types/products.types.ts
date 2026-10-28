import type {
  AdminProductSort,
  ProductStatus,
} from "@/redux/apis/types/product.types";

export type ProductTab = "products" | "inventory";

export type ProductFilters = {
  q: string;
  categoryId: string;
  status: ProductStatus | "";
  inStock: "true" | "false" | "";
  sort: AdminProductSort;
};

export const defaultProductFilters: ProductFilters = {
  q: "",
  categoryId: "",
  status: "",
  inStock: "",
  sort: "updated_desc",
};

/** A colour staged before the product exists (create screen). */
export type CreateColorDraft = {
  key: string;
  name: string;
  hex: string;
};

export const stockMatrixKey = (colorKey: string, size: string) =>
  `${colorKey}|${size}`;
