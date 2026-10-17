import { Suspense } from "react";
import LoginPage from "../_components/auth-page";

export default function Page() {
  return (
      <Suspense fallback={<div className="h-9 w-20 animate-pulse rounded bg-muted" />}>
          <LoginPage/>
      </Suspense>
  );
}
