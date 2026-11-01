import { baseApi } from "../baseApi";
import { unwrapData } from "../api.utils";
import type { Cart } from "./types/cart.types";
import type { FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import type { RootState } from "../store";

export const cartMutationKey = (operation: string) => `cart:${operation}`;

type CartMutation = { version: number };
async function cacheReturnedCart(
  _args: CartMutation,
  { dispatch, queryFulfilled }: {
    dispatch: import("../store").AppDispatch;
    queryFulfilled: PromiseLike<{ data: Cart }>;
  },
): Promise<void> {
  try {
    const { data } = await queryFulfilled;
    // updateQueryData never recreates a cache removed by logout. A late response
    // must also not overwrite a newer read/write from the same account.
    dispatch(cartApi.util.updateQueryData("getCart", undefined, (current) =>
      data.version >= current.version ? data : current));
  } catch { /* The calling mutation hook displays/reconciles the error. */ }
}

function cartError(error: FetchBaseQueryError, meta: FetchBaseQueryMeta | undefined) {
  const retryAfter = meta?.response?.headers.get("Retry-After");
  const seconds = retryAfter ? Number(retryAfter) : NaN;
  const delay = Number.isFinite(seconds) ? seconds * 1000 : retryAfter ? Date.parse(retryAfter) - Date.now() : 60_000;
  return { ...error, retryAfterMs: Number.isFinite(delay) ? Math.max(1000, delay) : 60_000 };
}

// The cache is intentionally owner-agnostic. Ownership always comes from the
// current session or cart cookie.
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => ({ url: "/cart", cache: "no-store", timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      keepUnusedDataFor: 86_400,
    }),
    addCartItem: builder.mutation<Cart, CartMutation & { variantId: string; quantity: number }>({
      query: ({ variantId, quantity, version }) => ({ url: "/cart/items", method: "POST", body: { variantId, quantity, version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      onQueryStarted: cacheReturnedCart,
    }),
    updateCartItem: builder.mutation<Cart, CartMutation & { id: string; quantity: number }>({
      query: ({ id, quantity, version }) => ({ url: `/cart/items/${id}`, method: "PATCH", body: { quantity, version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      onQueryStarted: cacheReturnedCart,
    }),
    removeCartItem: builder.mutation<Cart, CartMutation & { id: string }>({
      query: ({ id, version }) => ({ url: `/cart/items/${id}`, method: "DELETE", params: { version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      onQueryStarted: cacheReturnedCart,
    }),
    clearCart: builder.mutation<Cart, CartMutation>({
      query: ({ version }) => ({ url: "/cart", method: "DELETE", params: { version }, timeout: 15_000 }),
      transformResponse: unwrapData<Cart>,
      transformErrorResponse: cartError,
      onQueryStarted: cacheReturnedCart,
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
