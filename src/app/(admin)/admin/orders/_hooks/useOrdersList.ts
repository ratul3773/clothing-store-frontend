"use client";

import { authClient } from "@/lib/auth-client";
import { useGetAdminOrdersQuery } from "@/redux/apis/order.api";
import type { OrderQuery } from "@/redux/apis/types/order.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function useOrdersList() {
  const session = authClient.useSession();
  const router = useRouter();
  const [filters, setFilters] = useState<OrderQuery>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [creating, setCreating] = useState(false);
  const owner = session.data?.user.id ?? "";
  const query = useGetAdminOrdersQuery(
    { ...filters, page, limit, owner },
    {
      skip:
        session.isPending ||
        session.data?.user.role !== "admin" ||
        !!session.error,
      refetchOnMountOrArgChange: true,
    },
  );
  return { session, router, setFilters, setPage, limit, setLimit, creating, setCreating, owner, query };
}
