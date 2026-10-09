import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { COUPONS } from "@/lib/config";
import type { CartItem } from "@/lib/types";

export const MAX_QTY_PER_LINE = 5;

interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

const lineKey = (slug: string, color: string, size: string) =>
  `${slug}__${color}__${size}`;

const initialState: CartState = {
  items: [
    {
      key: lineKey("indigo-linen-shirt", "Indigo", "L"),
      slug: "indigo-linen-shirt",
      color: "Indigo",
      size: "L",
      quantity: 1,
    },
    {
      key: lineKey("everyday-tapered-chino", "Navy", "32"),
      slug: "everyday-tapered-chino",
      color: "Navy",
      size: "32",
      quantity: 1,
    },
  ],
  couponCode: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<
        Omit<CartItem, "key" | "quantity"> & { quantity?: number }
      >,
    ) {
      const { slug, color, size, quantity = 1 } = action.payload;
      const key = lineKey(slug, color, size);
      const existing = state.items.find((item) => item.key === key);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + quantity,
          MAX_QTY_PER_LINE,
        );
      } else {
        state.items.unshift({
          key,
          slug,
          color,
          size,
          quantity: Math.min(quantity, MAX_QTY_PER_LINE),
        });
      }
    },
    setQuantity(
      state,
      action: PayloadAction<{ key: string; quantity: number }>,
    ) {
      const item = state.items.find((i) => i.key === action.payload.key);
      if (item) {
        item.quantity = Math.max(
          1,
          Math.min(action.payload.quantity, MAX_QTY_PER_LINE),
        );
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.key !== action.payload);
    },
    clearCart(state) {
      state.items = [];
      state.couponCode = null;
    },
    applyCoupon(state, action: PayloadAction<string>) {
      const code = action.payload.trim().toUpperCase();
      if (COUPONS.some((c) => c.code === code)) state.couponCode = code;
    },
    removeCoupon(state) {
      state.couponCode = null;
    },
  },
});

export const {
  addItem,
  setQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
