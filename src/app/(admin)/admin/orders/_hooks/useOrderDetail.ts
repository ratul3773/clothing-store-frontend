"use client";

import { authClient } from "@/lib/auth-client";
import { useGetAdminOrderQuery } from "@/redux/apis/order.api";
import type { OrderStatus } from "@/redux/apis/types/order.types";
import { useState } from "react";

export default function useOrderDetail({ id }: { id: string }) {
  const session = authClient.useSession();
  const owner = session.data?.user.id ?? "";
  const query = useGetAdminOrderQuery(
    { id, owner },
    {
      skip:
        session.isPending ||
        session.data?.user.role !== "admin" ||
        !!session.error,
      refetchOnMountOrArgChange: true,
    },
  );
  const [target, setTarget] = useState<OrderStatus | null>(null);
  const [actionError, setActionError] = useState("");
  return { session, query, target, setTarget, actionError, setActionError };
}
