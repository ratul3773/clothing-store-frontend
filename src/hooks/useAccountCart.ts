"use client";

import { useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useStore } from "react-redux";
import type { RootState } from "@/redux/store";
import { useStore as Store } from "@/components/providers/StoreProvider";
import {
  useAddCartComboMutation,
  useUpdateCartComboMutation,
  useRemoveCartComboMutation,
  cartApi,
  cartMutationKey,
  hasPendingCartMutation,
  refreshCartPages,
  useAddCartItemMutation,
  useClearCartMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/redux/apis/cart.api";
import type { CartIntent } from "@/redux/apis/types/cart.types";
import type { PaginationQuery } from "@/redux/api.utils";
import { cartErrorStatus } from "@/lib/cart-view";
import { openCartDrawer } from "@/lib/cart-ui";

let mutationQueue = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const next = mutationQueue.then(task, task);
  mutationQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

const DEFAULT_PAGE: PaginationQuery = { page: 1, limit: 5 };

export default function useAccountCart(
  pagination: PaginationQuery = DEFAULT_PAGE,
  enabled = true,
  refreshOnMount = false,
) {
  const { toast } = Store();
  const store = useStore<RootState>();
  const query = useGetCartQuery(pagination, {
    skip: !enabled,
    pollingInterval: 0,
    refetchOnMountOrArgChange: refreshOnMount,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });
  const [add, added] = useAddCartItemMutation({
    fixedCacheKey: cartMutationKey("add"),
  });
  const [update, updated] = useUpdateCartItemMutation({
    fixedCacheKey: cartMutationKey("quantity"),
  });
  const [remove, removed] = useRemoveCartItemMutation({
    fixedCacheKey: cartMutationKey("remove"),
  });
  const [clear, cleared] = useClearCartMutation({
    fixedCacheKey: cartMutationKey("clear"),
  });
  const [addCombo, comboAdded] = useAddCartComboMutation({
    fixedCacheKey: cartMutationKey("addCombo"),
  });
  const [updateCombo, comboUpdated] = useUpdateCartComboMutation({
    fixedCacheKey: cartMutationKey("comboQuantity"),
  });
  const [removeCombo, comboRemoved] = useRemoveCartComboMutation({
    fixedCacheKey: cartMutationKey("removeCombo"),
  });
  const pendingWrite = useAppSelector(hasPendingCartMutation);
  const busy =
    pendingWrite ||
    comboAdded.isLoading ||
    comboUpdated.isLoading ||
    comboRemoved.isLoading ||
    added.isLoading ||
    updated.isLoading ||
    removed.isLoading ||
    cleared.isLoading;
  const { refetch } = query;

  const run = useCallback(
    (intent: CartIntent) =>
      enqueue(async () => {
        if (!enabled) return false;
        const state = store.getState();
        const cached = cartApi.endpoints.getCart.select(pagination)(state);
        if (hasPendingCartMutation(state) || cached.status === "pending")
          return false;
        if (!cached.data || cached.error)
          throw new Error("Reload your bag before making changes.");
        const cart = cached.data.data;

        if (intent.type === "add" || intent.type === "addCombo") {
          if (!Number.isSafeInteger(intent.quantity) || intent.quantity < 1)
            throw new Error("Choose a positive quantity.");
          const existing = cart.items.find((item) =>
            intent.type === "add"
              ? item.type === "VARIANT" && item.variantId === intent.variantId
              : item.type === "COMBO" &&
                item.comboId === intent.comboId &&
                item.selections.length === intent.selections.length &&
                intent.selections.every((choice) =>
                  item.selections.some(
                    (saved) =>
                      saved.comboItemId === choice.comboItemId &&
                      saved.variantId === choice.variantId,
                  ),
                ),
          );
          if (
            existing &&
            intent.quantity > Number.MAX_SAFE_INTEGER - existing.quantity
          )
            throw new Error("The requested quantity is too large.");
          // Existing combo capacity belongs to these exact saved sizes; it must not
          // be borrowed from a different configuration of the same combo.
          if (
            existing &&
            existing.quantity + intent.quantity > existing.maxQuantity
          )
            throw new Error("The requested quantity is not available.");
        }
        if (intent.type === "quantity") {
          const item = cart.items.find((line) => line.id === intent.id);
          if (!item) throw new Error("This item was removed. Reload your bag.");
          if (!Number.isSafeInteger(intent.quantity) || intent.quantity < 1)
            throw new Error("Choose a positive quantity.");
          if (
            intent.quantity > item.quantity &&
            intent.quantity > item.maxQuantity
          )
            throw new Error("The requested quantity is not available.");
        }

        const common = { version: cart.version };
        const line =
          "id" in intent
            ? cart.items.find((item) => item.id === intent.id)
            : undefined;
        if ((intent.type === "quantity" || intent.type === "remove") && !line)
          throw new Error("This item was removed. Reload your bag.");
        if (
          (intent.type === "quantity" || intent.type === "remove") &&
          line?.type !== intent.lineType
        )
          throw new Error("This item changed. Reload your bag.");

        const request =
          intent.type === "addCombo"
            ? addCombo({
                ...common,
                comboId: intent.comboId,
                quantity: intent.quantity,
                selections: intent.selections,
              })
            : intent.type === "add"
              ? add({
                  ...common,
                  variantId: intent.variantId,
                  quantity: intent.quantity,
                })
              : intent.type === "quantity"
                ? (line?.type === "COMBO" ? updateCombo : update)({
                    ...common,
                    id: intent.id,
                    quantity: intent.quantity,
                  })
                : intent.type === "remove"
                  ? (line?.type === "COMBO" ? removeCombo : remove)({
                      ...common,
                      id: intent.id,
                    })
                  : clear(common);

        const toastMessage =
          intent.type === "addCombo" || intent.type === "add"
            ? "Added to your bag"
            : intent.type === "quantity"
              ? "Cart updated"
              : intent.type === "remove"
                ? "Removed item from your bag"
                : intent.type === "clear"
                  ? "Whole bag is cleared"
                  : "Bag updated";
        try {
          await request.unwrap();
          toast(toastMessage);
          if (intent.type === "addCombo" || intent.type === "add") {
            openCartDrawer();
          }
        } catch (error) {
          const status = cartErrorStatus(error);
          if (
            status !== 400 &&
            status !== 403 &&
            status !== 422 &&
            status !== 429
          ) {
            try {
              await refetch().unwrap();
            } catch {
              /* Preserve the original failure. */
            }
          }
          throw error;
        }
        // The write has succeeded. A failed follow-up read must not turn it into
        // a failed write or encourage the user to submit the same addition twice.
        await refreshCartPages(store.dispatch, store.getState);
        return true;
      }),
    [
      enabled,
      store,
      pagination,
      add,
      update,
      remove,
      addCombo,
      updateCombo,
      removeCombo,
      clear,
      refetch,
    ],
  );

  return { query, busy, run };
}
