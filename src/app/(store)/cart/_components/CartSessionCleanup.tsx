"use client";

import { useLayoutEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppDispatch } from "@/redux/hooks";
import { cartApi } from "@/redux/apis/cart.api";

/** Clear stale cart state when the server-resolved owner changes. */
export default function CartSessionCleanup() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const id = user?.id ?? "guest";
  const previous = useRef<string | null>(null);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    if (previous.current && previous.current !== id) {
      dispatch((dispatch, getState) => {
        for (const args of cartApi.util.selectCachedArgsForQuery(getState(), "getCart")) {
          dispatch(cartApi.util.getRunningQueryThunk("getCart", args))?.abort();
        }
      });
      for (const request of dispatch(cartApi.util.getRunningMutationsThunk())) {
        if (["addCartCombo", "updateCartCombo", "removeCartCombo", "addCartItem", "updateCartItem", "removeCartItem", "clearCart"].includes(request.arg.endpointName)) request.abort();
      }
      dispatch(cartApi.util.resetApiState());
    }
    previous.current = id;
  }, [dispatch, id]);
  return null;
}
