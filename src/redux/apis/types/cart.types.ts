export type CartItemStatus = "AVAILABLE" | "INSUFFICIENT_STOCK" | "OUT_OF_STOCK" | "UNAVAILABLE";
export type CartPageQuery = { page: number; itemsPerPage: number };

export type CartItem = {
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
  pagination?: { currentPage: number; totalPages: number; itemsPerPage: number; totalItems: number };
  selectionItems?: Array<{ id: string; status: CartItemStatus; lineSubtotal: number | null }>;
};

export type CartIntent =
  | { type: "add"; variantId: string; quantity: number }
  | { type: "quantity"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "clear" };
