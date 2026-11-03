export type CartItemStatus = "AVAILABLE" | "INSUFFICIENT_STOCK" | "OUT_OF_STOCK" | "UNAVAILABLE" | "SELECTION_REQUIRED";

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
  type: "COMBO"; comboId: string | null; variantId: null; product: null; variant: null; regularPrice: null;
  combo: import("./combo.types").Combo | null;
  selections: import("./combo.types").CartComboSelection[];
  requiresSelection: boolean;
  selectionIssue?: "INCOMPLETE" | "INVALID" | null;
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
  | { type: "addCombo"; comboId: string; quantity: number; selections: import("./combo.types").ComboSelection[] }
  | { type: "add"; variantId: string; quantity: number }
  | { type: "quantity"; id: string; lineType: "VARIANT" | "COMBO"; quantity: number }
  | { type: "selections"; id: string; selections: import("./combo.types").ComboSelection[] }
  | { type: "remove"; id: string; lineType: "VARIANT" | "COMBO" }
  | { type: "clear" };
