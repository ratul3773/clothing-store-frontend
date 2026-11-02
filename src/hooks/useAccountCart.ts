"use client";

import { useCallback } from "react";
import { useStore } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useAddCartComboMutation, useUpdateCartComboMutation, useRemoveCartComboMutation,
  cartApi,
  cartMutationKey,
  hasPendingCartMutation,
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/redux/apis/cart.api";
import type { CartIntent } from "@/redux/apis/types/cart.types";
import type { PaginationQuery } from "@/redux/api.utils";
import { cartErrorStatus } from "@/lib/cart-view";

let mutationQueue = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const next = mutationQueue.then(task, task);
  mutationQueue = next.then(() => undefined, () => undefined);
  return next;
}

const DEFAULT_PAGE: PaginationQuery = { page: 1, limit: 5 };

export default function useAccountCart(pagination: PaginationQuery = DEFAULT_PAGE) {
  const store = useStore<RootState>();
  const query = useGetCartQuery(pagination, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const [add, added] = useAddCartItemMutation({ fixedCacheKey: cartMutationKey("add") });
  const [update, updated] = useUpdateCartItemMutation({ fixedCacheKey: cartMutationKey("quantity") });
  const [remove, removed] = useRemoveCartItemMutation({ fixedCacheKey: cartMutationKey("remove") });
  const [clear, cleared] = useClearCartMutation({ fixedCacheKey: cartMutationKey("clear") });
  const [addCombo, comboAdded] = useAddCartComboMutation({ fixedCacheKey: cartMutationKey("addCombo") });
  const [updateCombo, comboUpdated] = useUpdateCartComboMutation({ fixedCacheKey: cartMutationKey("comboQuantity") });
  const [removeCombo, comboRemoved] = useRemoveCartComboMutation({ fixedCacheKey: cartMutationKey("removeCombo") });
  const busy = comboAdded.isLoading || comboUpdated.isLoading || comboRemoved.isLoading || added.isLoading || updated.isLoading || removed.isLoading || cleared.isLoading;
  const { refetch } = query;

  const run = useCallback((intent: CartIntent) => enqueue(async () => {
    const state = store.getState();
    const cached = cartApi.endpoints.getCart.select(pagination)(state);
    if (hasPendingCartMutation(state) || cached.status === "pending") return false;
    if (!cached.data || cached.error) throw new Error("Reload your bag before making changes.");
    const cart = cached.data.data;

    if (intent.type === "add" || intent.type === "addCombo") {
      if (!Number.isSafeInteger(intent.quantity) || intent.quantity < 1)
        throw new Error("Choose a positive quantity.");
      const existing = cart.items.find((item) => intent.type === "add" ? item.type === "VARIANT" && item.variantId === intent.variantId : item.type === "COMBO" && item.comboId === intent.comboId);
      if (existing && intent.quantity > Number.MAX_SAFE_INTEGER - existing.quantity)
        throw new Error("The requested quantity is too large.");
    }
    if (intent.type === "quantity") {
      const item = cart.items.find((line) => line.id === intent.id);
      if (!item) throw new Error("This item was removed. Reload your bag.");
      if (!Number.isSafeInteger(intent.quantity) || intent.quantity < 1)
        throw new Error("Choose a positive quantity.");
      if (intent.quantity > item.quantity && intent.quantity > item.maxQuantity)
        throw new Error("The requested quantity is not available.");
    }

    const common = { version: cart.version };
    const line = "id" in intent ? cart.items.find((item) => item.id === intent.id) : undefined;
    if ((intent.type === "quantity" || intent.type === "remove") && !line) throw new Error("This item was removed. Reload your bag.");
    const request = intent.type === "addCombo"
      ? addCombo({ ...common, comboId: intent.comboId, quantity: intent.quantity })
      : intent.type === "add"
      ? add({ ...common, variantId: intent.variantId, quantity: intent.quantity })
      : intent.type === "quantity"
        ? (line?.type === "COMBO" ? updateCombo : update)({ ...common, id: intent.id, quantity: intent.quantity })
        : intent.type === "remove"
          ? (line?.type === "COMBO" ? removeCombo : remove)({ ...common, id: intent.id })
          : clear(common);
    try {
      await request.unwrap();
      return true;
    } catch (error) {
      const status = cartErrorStatus(error);
      if (status !== 400 && status !== 403 && status !== 422 && status !== 429) {
        try { await refetch().unwrap(); } catch { /* Preserve the original failure. */ }
      }
      throw error;
    }
  }), [store, pagination, add, update, remove, addCombo, updateCombo, removeCombo, clear, refetch]);

  return { query, busy, run };
}
