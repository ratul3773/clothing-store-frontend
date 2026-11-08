"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Btn, Card, CardHeader, PageHeader } from "@/components/cms/ui";
import { Skeleton } from "@/components/ui/skeleton";
import OrderReceipt from "@/components/common/OrderReceipt";
import StatusBadge from "@/components/cms/StatusBadge";
import { useGetAdminOrderQuery } from "@/redux/apis/order.api";
import type { OrderStatus } from "@/redux/apis/types/order.types";
import { nextOrderStatuses, orderLabel } from "@/lib/order-rules";
import { apiErrorMessage } from "@/redux/api.utils";
import OrderTransitionDialog from "./OrderTransitionDialog";

export default function OrderDetail({ id }: { id: string }) {
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
  if (session.isPending || query.isLoading)
    return <Skeleton className="h-96" />;
  const order = query.currentData;
  if (!order)
    return (
      <div className="space-y-4" role="alert">
        <PageHeader title="Order unavailable" />
        <p>{apiErrorMessage(query.error || session.error)}</p>
        <Btn onClick={() => void query.refetch()}>Retry</Btn>
        <Link href="/admin/orders">Back to orders</Link>
      </div>
    );
  return (
    <div className="space-y-5">
      {actionError && (
        <p role="alert" className="text-destructive">
          {actionError}
        </p>
      )}
      <PageHeader
        title={order.number}
        description={`${orderLabel(order.source)} · ${new Date(order.createdAt).toLocaleString("en-GB")}`}
        crumbs={["Orders", order.number]}
        actions={
          <>
            <Link href="/admin/orders">
              <Btn>Back</Btn>
            </Link>
            <Btn onClick={() => window.print()}>Print receipt</Btn>
            <Btn
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Refresh
            </Btn>
          </>
        }
      />
      <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <OrderReceipt order={order} printable />
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader title="Status & fulfillment" />
            <div className="space-y-4 p-4">
              <StatusBadge status={order.status} />
              <p className="text-sm">
                Cash on delivery ·{" "}
                {order.paidAt
                  ? `Collected ${new Date(order.paidAt).toLocaleString("en-GB")}`
                  : "Unpaid"}
              </p>
              {order.expiresAt && (
                <p className="text-xs text-muted-foreground">
                  Pending hold expires{" "}
                  {new Date(order.expiresAt).toLocaleString("en-GB")}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {nextOrderStatuses(order.status).map((status) => (
                  <Btn
                    key={status}
                    disabled={query.isFetching}
                    onClick={() => setTarget(status)}
                  >
                    {status === "RETURNED"
                      ? "Inspect returned goods"
                      : `Mark as ${orderLabel(status)}`}
                  </Btn>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <CardHeader title="History" />
            <ol className="space-y-4 p-4">
              {order.history.map((event) => (
                <li
                  key={event.id}
                  className="border-l border-border pl-3 text-sm"
                >
                  <p className="font-medium">
                    {event.event === "EXPIRED"
                      ? "Expired — stock released"
                      : orderLabel(event.toStatus)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString("en-GB")} ·{" "}
                    {event.actorType}
                    {event.actorId ? ` (${event.actorId})` : ""}
                  </p>
                  {event.reason && <p>{event.reason}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
      {target && (
        <OrderTransitionDialog
          key={`${order.id}:${order.version}:${target}`}
          order={order}
          target={target}
          onClose={() => setTarget(null)}
          onConflict={() => {
            setTarget(null);
            setActionError(
              "This order changed. Review its refreshed status before trying another action.",
            );
            void query.refetch();
          }}
        />
      )}
    </div>
  );
}
