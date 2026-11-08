"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  hasPendingCartMutation,
  refreshCartPages,
} from "@/redux/apis/cart.api";
import {
  useCreateManualOrderMutation,
  useCreateOrderMutation,
} from "@/redux/apis/order.api";
import { apiErrorMessage } from "@/redux/api.utils";
import type {
  CheckoutPayload,
  ManualOrderPayload,
  OrderReceipt,
} from "@/redux/apis/types/order.types";
import {
  clearOrderAttempt,
  readOrderAttempt,
  rememberGuestOrder,
  saveOrderAttempt,
  type OrderAttempt,
} from "@/lib/order-storage";
import { isUncertainOrderError } from "@/lib/order-rules";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/baseApi";
import { isConflictError } from "@/redux/api.utils";

// Call inside an owner-keyed client component; an account switch must remount it.
export default function useOrderAttempt(
  owner: string,
  manual: boolean,
  onSuccess: (order: OrderReceipt) => void,
) {
  const [attempt, setAttempt] = useState<OrderAttempt | null>(() =>
    readOrderAttempt(owner, manual),
  );
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [createOrder, createState] = useCreateOrderMutation();
  const [createManual, manualState] = useCreateManualOrderMutation();
  const submitting = useRef(false);
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const submit = async (body?: CheckoutPayload | ManualOrderPayload) => {
    if (submitting.current) return;
    if (!manual && hasPendingCartMutation(store.getState())) return;
    const next = attempt ?? (body ? { key: crypto.randomUUID(), body } : null);
    if (!next) return;
    if (!saveOrderAttempt(owner, manual, next)) {
      setError(
        "Browser session storage is required to safely submit this order. Enable it and retry.",
      );
      return;
    }
    submitting.current = true;
    setAttempt(next);
    setError("");
    try {
      const order = await (
        manual
          ? createManual({
              key: next.key,
              body: next.body as ManualOrderPayload,
            })
          : createOrder({ key: next.key, body: next.body as CheckoutPayload })
      ).unwrap();
      if (order.guestToken) rememberGuestOrder(order.id, order.guestToken);
      clearOrderAttempt(owner, manual);
      setAttempt(null);
      if (!manual) void refreshCartPages(dispatch, store.getState);
      if (active.current) onSuccess(order);
      return order;
    } catch (failure) {
      if (isConflictError(failure)) {
        setConflict(true);
        dispatch(
          baseApi.util.invalidateTags([
            "Order",
            "Cart",
            "Products",
            "Combos",
            "Inventory",
          ]),
        );
        if (!manual) void refreshCartPages(dispatch, store.getState);
      }
      const uncertain = isUncertainOrderError(failure);
      setError(
        apiErrorMessage(failure) +
          (uncertain
            ? " The result is unconfirmed. Retry this same order before making another."
            : " Review the order before trying again."),
      );
      if (!uncertain) {
        clearOrderAttempt(owner, manual);
        setAttempt(null);
      }
    } finally {
      submitting.current = false;
    }
  };
  return {
    submit,
    attempt,
    error,
    conflict,
    clearConflict: () => setConflict(false),
    pending: createState.isLoading || manualState.isLoading,
  };
}
