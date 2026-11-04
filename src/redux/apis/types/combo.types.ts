export type ComboComponent = {
  id: string;
  colorId: string;
  quantity: number;
  /** Omitted or null allows all variants; otherwise at least one ID is required. */
  variantIds?: string[] | null;
  product: { id: string; name: string; slug: string; imageUrl: string | null; unitPrice: number };
  color: { id: string; name: string; hex: string | null };
  variants: Array<{ id: string; size: string; available: number; maxQuantity: number }>;
};
export type ComboSelection = { comboItemId: string; variantId: string };
export type CartComboSelection = ComboSelection & { size: string };
export type Combo = {
  id: string; name: string; slug: string; description: string | null;
  price: number; currency: "BDT"; moneyUnit: "taka"; imageUrl: string | null;
  combinedPrice: number; savings: number; discountPercentage: number;
  startsAt: string | null; endsAt: string | null; isActive: boolean;
  items: ComboComponent[]; maxQuantity: number; inStock: boolean;
};
export type CreateCombo = {
  name: string; description?: string | null; price: number; isActive?: boolean;
  startsAt?: string | null; endsAt?: string | null;
  items: Array<{ colorId: string; quantity: number; variantIds?: string[] | null }>;
};
export type UpdateCombo = Partial<CreateCombo>;
