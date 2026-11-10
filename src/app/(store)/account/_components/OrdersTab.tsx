"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useGetOrdersQuery } from "@/redux/apis/order.api";
import { apiErrorMessage } from "@/redux/api.utils";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import OrdersSkeleton from "./OrdersSkeleton";
import StatusBadge from "@/components/common/StatusBadge";
import { bdt } from "@/lib/utils";

export default function OrdersTab() {
  const session = authClient.useSession();
  const user = session.data?.user;
  const owner = user?.id ?? "";
  const [pagination, setPagination] = useState({
    owner: "",
    page: 1,
    limit: 5,
  });
  const { page, limit } =
    pagination.owner === owner ? pagination : { page: 1, limit: 5 };
  const setPage = (value: number) =>
    setPagination({ owner, page: value, limit });
  const query = useGetOrdersQuery(
    { owner: user?.id ?? "", page, limit },
    {
      skip:
        session.isPending ||
        !!session.error ||
        user?.role !== "customer" ||
        !user.emailVerified,
      refetchOnMountOrArgChange: true,
    },
  );
  if (session.isPending || query.isLoading || (query.isFetching && !query.currentData))
    return <OrdersSkeleton count={limit} />;
  if (query.error || session.error)
    return (
      <div role="alert">
        <p>{apiErrorMessage(query.error || session.error)}</p>
        <Button onClick={() => void query.refetch()}>Retry orders</Button>
      </div>
    );
  const data = query.currentData;
  return (
    <div className="space-y-4" aria-busy={query.isFetching}>
      {!data?.items.length && (
        <p className="text-muted-foreground">
          {query.isFetching
            ? "Loading orders…"
            : "You have no orders on this page."}
        </p>
      )}
      {data?.items.map((order) => (
        <article
          key={order.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-card/70 p-5"
        >
          <div className="space-y-2">
            <p className="font-semibold">{order.number}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("en-GB")} ·{" "}
              {order.recipientName}
            </p>
            <div className="flex gap-3">
              <StatusBadge status={order.status} />
              <span>{bdt(order.total)}</span>
            </div>
          </div>
          <Button to={`/order?id=${order.id}`} variant="outline" size="sm">
            View receipt
          </Button>
        </article>
      ))}
      {data?.meta && (
        <Pagination
          paginationInfo={data.meta}
          onPageChange={setPage}
          onItemsPerPageChange={(value) =>
            setPagination({ owner, page: 1, limit: value })
          }
        />
      )}
    </div>
  );
}
