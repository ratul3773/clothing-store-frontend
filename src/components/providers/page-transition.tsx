"use client";

import { Suspense, type ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {

  return (
    <Suspense fallback={<div className="page-transition" aria-live="polite" />}>
      {children}
    </Suspense>
  );
}
