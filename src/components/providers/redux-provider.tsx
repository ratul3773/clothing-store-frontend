"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";
import CartSessionCleanup from "@/components/common/cart/CartSessionCleanup";

export default function ReduxProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [store] = useState(makeStore);
  // Streamed routes hydrate against their original Redux snapshot.
  const [serverState] = useState(() => store.getState());
  return <Provider store={store} serverState={serverState}><Suspense fallback={null}><CartSessionCleanup /></Suspense>{children}</Provider>;
}
