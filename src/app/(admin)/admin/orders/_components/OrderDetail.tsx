"use client";

import { CmsButton } from "@/components/ui/button";
import useOrderDetail from "../_hooks/useOrderDetail";

import StatusBadge from "@/components/common/StatusBadge";
import { Card, CardHeader, PageHeader } from "@/components/cms/ui";
import OrderReceipt from "@/components/common/OrderReceipt";
import { Skeleton } from "@/components/ui/skeleton";
import { nextOrderStatuses, orderLabel } from "@/lib/order-rules";
import { apiErrorMessage } from "@/redux/api.utils";
import Link from "next/link";
import OrderTransitionDialog from "./OrderTransitionDialog";

export default function OrderDetail({ id }: { id: string }) {
  const { session, query, target, setTarget, actionError, setActionError } =
    useOrderDetail({ id });
  if (session.isPending || query.isLoading)
    return <Skeleton className="h-96" />;
  const order = query.currentData;
  if (!order)
    return (
      <div className="space-y-4" role="alert">
        <PageHeader title="Order unavailable" />
        <p>{apiErrorMessage(query.error || session.error)}</p>
        <CmsButton variant="outline" onClick={() => void query.refetch()}>Retry</CmsButton>
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
              <CmsButton variant="outline">Back</CmsButton>
            </Link>
            <CmsButton variant="outline" onClick={() => window.print()}>Print receipt</CmsButton>
            <CmsButton variant="outline"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              Refresh
            </CmsButton>
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
                  <CmsButton variant="outline"
                    key={status}
                    disabled={query.isFetching}
                    onClick={() => setTarget(status)}
                  >
                    {status === "RETURNED"
                      ? "Inspect returned goods"
                      : `Mark as ${orderLabel(status)}`}
                  </CmsButton>
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
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    <StatusBadge status={event.toStatus} />
                    {event.event === "EXPIRED"
                      ? "Expired — stock released"
                      : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.createdAt).toLocaleString("en-GB")} ·{" "}
                    {event.actorType}
                  </p>
                  {event.actor ? (
                    <div className="break-words text-xs text-muted-foreground">
                      <p>{event.actor.name}</p>
                      <p className="break-all">{event.actor.email}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {event.actorType === "SYSTEM" ? "System" : event.actorType === "CUSTOMER" && !event.actorId ? "Guest" : "Unavailable user"}
                    </p>
                  )}
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
