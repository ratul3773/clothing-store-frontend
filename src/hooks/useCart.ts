"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { authClient } from "@/lib/auth-client";
import useCartApi from "./useAccountCart";
import { cartErrorMessage, cartErrorStatus, type CartLineView } from "@/lib/cart-view";
import type { CartIntent, CartPageQuery } from "@/redux/apis/types/cart.types";

export default function useCart(pagination?: CartPageQuery) {
  const clientReady = useSyncExternalStore(noSubscription, clientSnapshot, serverSnapshot);
  const session = authClient.useSession();
  const user = session.data?.user;
  const customer = user?.role === "customer" && user.emailVerified;
  const account = useCartApi(pagination);
  const { query, busy, run } = account;
  const mode = !clientReady || session.isPending
    ? "resolving"
    : session.error
      ? "session-error"
      : user
        ? customer ? "account" : "restricted"
        : "guest";
  const identityKey = mode === "resolving" ? mode : user?.id ?? mode;
  const [local, setLocal] = useState<{
    identity: string;
    error: unknown;
    selected: Record<string, boolean>;
  }>({ identity: "", error: null, selected: {} });
  const selected = local.identity === identityKey ? local.selected : EMPTY_SELECTION;
  const localError = local.identity === identityKey ? local.error : null;
  const error = localError || query.error;
  const status = cartErrorStatus(error);
  const blocked = mode === "restricted" || mode === "session-error" || status === 401 || status === 403;
  const lines = useMemo<CartLineView[]>(() => {
    if (blocked || mode === "resolving") return [];
    return (query.currentData?.items ?? []).map((item) => ({
      ...item,
      selected: item.status === "AVAILABLE" && (selected[item.id] ?? true),
    }));
  }, [blocked, mode, query.currentData, selected]);

  const setError = useCallback((value: unknown) => setLocal((current) => ({
    identity: identityKey,
    selected: current.identity === identityKey ? current.selected : {},
    error: value,
  })), [identityKey]);

  const edit = useCallback(async (intent: CartIntent) => {
    if (blocked || mode === "resolving") return false;
    try {
      const success = await run(intent);
      if (success) setError(null);
      return success;
    } catch (failure) {
      setError(failure);
      return false;
    }
  }, [blocked, mode, run, setError]);

  const setSelection = useCallback((ids: string[], value: boolean) => {
    if (blocked || mode === "resolving") return;
    setLocal((current) => ({
      identity: identityKey,
      error: current.identity === identityKey ? current.error : null,
      selected: {
        ...(current.identity === identityKey ? current.selected : {}),
        ...Object.fromEntries(ids.map((id) => [id, value])),
      },
    }));
  }, [blocked, identityKey, mode]);

  const reload = async () => {
    try {
      await query.refetch().unwrap();
      setError(null);
    } catch (failure) {
      setError(failure);
    }
  };
  const retrySession = async () => {
    await session.refetch();
    await reload();
  };

  const selectionItems = blocked || mode === "resolving" ? [] : query.currentData?.selectionItems ?? lines;
  const eligible = selectionItems.filter((item) => item.status === "AVAILABLE");
  const selection = eligible.filter((item) => selected[item.id] ?? true);
  const cart = {
    mode: blocked && status === 401 ? "session-error" : mode,
    identityKey,
    userId: customer ? user?.id ?? null : null,
    lines,
    loading: query.isFetching,
    ready: !blocked && mode !== "resolving" && !!query.currentData && !error,
    busy,
    error: error ? cartErrorMessage(error) : "",
    count: blocked || mode === "resolving" ? 0 : query.currentData?.totalQuantity ?? 0,
    pagination: query.currentData?.pagination,
    eligibleIds: eligible.map((item) => item.id),
    selectedCount: selection.length,
    allSelected: eligible.length > 0 && eligible.length === selection.length,
    selectedSubtotal: selection.reduce((sum, item) => sum + (item.lineSubtotal ?? 0), 0),
  };
  return { cart, edit, setSelection, reload, retrySession };
}

const noSubscription = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const EMPTY_SELECTION: Record<string, boolean> = {};
