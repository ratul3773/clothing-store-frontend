export type ComboComponent = {
  variantId: string;
  quantity: number;
  product: { id: string; name: string; slug: string; imageUrl: string | null };
  variant: { color: string; size: string };
};
export type Combo = {
  id: string; name: string; slug: string; description: string | null;
  price: number; currency: "BDT"; moneyUnit: "taka"; imageUrl: string | null;
  startsAt: string | null; endsAt: string | null; isActive: boolean;
  items: ComboComponent[]; maxQuantity: number; inStock: boolean;
};
export type CreateCombo = {
  name: string; description?: string | null; price: number; isActive?: boolean;
  startsAt?: string | null; endsAt?: string | null;
  items: Array<{ variantId: string; quantity: number }>;
};
export type UpdateCombo = Partial<CreateCombo>;
