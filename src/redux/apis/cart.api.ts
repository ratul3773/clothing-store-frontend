import { baseApi } from "../baseApi";
import { unwrapData } from "../api.utils";
import type { Cart, CartPageQuery } from "./types/cart.types";
import type { FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";

export const cartMutationKey = (operation: string) => `cart:${operation}`;

type CartMutation = { version: number };

function cartError(error: FetchBaseQueryError, meta: FetchBaseQueryMeta | undefined) {
  const retryAfter = meta?.response?.headers.get("Retry-After");
  const seconds = retryAfter ? Number(retryAfter) : NaN;
  const delay = Number.isFinite(seconds) ? seconds * 1000 : retryAfter ? Date.parse(retryAfter) - Date.now() : 60_000;
  return { ...error, retryAfterMs: Number.isFinite(delay) ? Math.max(1000, delay) : 60_000 };
}

// The cache is intentionally owner-agnostic. Ownership always comes from the
// current session or cart cookie.
// Mutations invalidate every page: inserting/removing a line shifts page
// boundaries, so a full mutation response must never replace one page's data.
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, CartPageQuery>({
      query: (pagination) => ({ url: "/cart", params: pagination, cache: "no-store", timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      keepUnusedDataFor: 60,
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<Cart, CartMutation & { variantId: string; quantity: number }>({
      query: ({ variantId, quantity, version }) => ({ url: "/cart/items", method: "POST", body: { variantId, quantity, version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      invalidatesTags: (result) => result ? ["Cart"] : [],
    }),
    updateCartItem: builder.mutation<Cart, CartMutation & { id: string; quantity: number }>({
      query: ({ id, quantity, version }) => ({ url: `/cart/items/${id}`, method: "PATCH", body: { quantity, version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      invalidatesTags: (result) => result ? ["Cart"] : [],
    }),
    removeCartItem: builder.mutation<Cart, CartMutation & { id: string }>({
      query: ({ id, version }) => ({ url: `/cart/items/${id}`, method: "DELETE", params: { version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      invalidatesTags: (result) => result ? ["Cart"] : [],
    }),
    clearCart: builder.mutation<Cart, CartMutation>({
      query: ({ version }) => ({ url: "/cart", method: "DELETE", params: { version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      invalidatesTags: (result) => result ? ["Cart"] : [],
    }),
  }),
});

export const {
  useGetCartQuery, useAddCartItemMutation, useUpdateCartItemMutation,
  useRemoveCartItemMutation, useClearCartMutation,
} = cartApi;

// Read RTK Query's own pending states synchronously so rapid clicks in different
// components cannot start overlapping writes. There is no custom lock or queue.
export function hasPendingCartMutation(state: RootState) {
  return [
    cartApi.endpoints.addCartItem.select(cartMutationKey("add"))(state),
    cartApi.endpoints.updateCartItem.select(cartMutationKey("quantity"))(state),
    cartApi.endpoints.removeCartItem.select(cartMutationKey("remove"))(state),
    cartApi.endpoints.clearCart.select(cartMutationKey("clear"))(state),
  ].some((result) => result.status === "pending");
}
