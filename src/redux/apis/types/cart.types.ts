export type CartItemStatus = "AVAILABLE" | "INSUFFICIENT_STOCK" | "OUT_OF_STOCK" | "UNAVAILABLE";

export type VariantCartItem = {
  type: "VARIANT";
  id: string;
  variantId: string;
  quantity: number;
  status: CartItemStatus;
  maxQuantity: number;
  product: { id: string; name: string; slug: string; imageUrl: string | null } | null;
  variant: { color: string; size: string } | null;
  regularPrice: number | null;
  unitPrice: number | null;
  lineSubtotal: number | null;
};

export type ComboCartItem = Omit<VariantCartItem, "type" | "variantId" | "product" | "variant" | "regularPrice"> & {
  type: "COMBO"; comboId: string; variantId: null; product: null; variant: null; regularPrice: null;
  combo: import("./combo.types").Combo | null;
};
export type CartItem = VariantCartItem | ComboCartItem;

export type Cart = {
  id: string | null;
  version: number;
  currency: "BDT";
  moneyUnit: "taka";
  limits: { distinctItems: number | null; quantityPerVariant: number | null };
  items: CartItem[];
  distinctItemCount: number;
  totalQuantity: number;
  validItemsSubtotal: number;
  allItemsAvailable: boolean;
  selectionItems?: Array<{ id: string; type: "VARIANT" | "COMBO"; status: CartItemStatus; lineSubtotal: number | null }>;
};

export type CartIntent =
  | { type: "addCombo"; comboId: string; quantity: number }
  | { type: "add"; variantId: string; quantity: number }
  | { type: "quantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" };
