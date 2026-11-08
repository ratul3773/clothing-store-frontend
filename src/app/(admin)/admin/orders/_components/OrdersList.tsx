"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Btn, Card, PageHeader } from "@/components/cms/ui";
import DataTable from "@/components/cms/DataTable";
import StatusBadge from "@/components/cms/StatusBadge";
import Pagination from "@/components/common/Pagination";
import { useGetAdminOrdersQuery } from "@/redux/apis/order.api";
import type { OrderQuery } from "@/redux/apis/types/order.types";
import { apiErrorMessage } from "@/redux/api.utils";
import { bdt } from "@/lib/utils";
import { orderLabel } from "@/lib/order-rules";
import OrdersFilters from "./OrdersFilters";
import ManualOrderModal from "./ManualOrderModal";
import { CmsButton } from "@/components/ui/button";

export default function OrdersList() {
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
  return (
    <div>
      <PageHeader
        title="Orders"
        description={
          query.currentData?.meta
            ? `${query.currentData.meta.total} matching orders`
            : "Cash on delivery orders"
        }
        actions={
          <CmsButton
            
            disabled={!owner}
            onClick={() => setCreating(true)}
          >
            <Plus className="size-4" />
            Create manual order
          </CmsButton>
        }
      />
      <Card>
        <OrdersFilters
          onChange={(values) => {
            setFilters(values);
            setPage(1);
          }}
        />
        {query.error || session.error ? (
          <div role="alert" className="space-y-3 p-5">
            <p>{apiErrorMessage(query.error || session.error)}</p>
            <CmsButton onClick={() => void query.refetch()}>Retry</CmsButton>
          </div>
        ) : (
          <DataTable
            rows={query.currentData?.items ?? []}
            rowKey={(order) => order.id}
            isLoading={query.isFetching || session.isPending}
            pageSize={limit}
            hidePagination
            onRowClick={(order) => router.push(`/admin/orders?id=${order.id}`)}
            columns={[
              {
                key: "number",
                header: "Order",
                cell: (order) => (
                  <span className="font-medium">{order.number}</span>
                ),
              },
              {
                key: "date",
                header: "Date",
                cell: (order) =>
                  new Date(order.createdAt).toLocaleDateString("en-GB"),
              },
              {
                key: "customer",
                header: "Customer",
                cell: (order) => (
                  <div>
                    {order.recipientName}
                    <p className="text-xs text-muted-foreground">
                      {order.recipientPhone}
                    </p>
                  </div>
                ),
              },
              {
                key: "source",
                header: "Source",
                cell: (order) => orderLabel(order.source),
              },
              {
                key: "status",
                header: "Status",
                cell: (order) => <StatusBadge status={order.status} />,
              },
              {
                key: "payment",
                header: "Payment",
                cell: (order) =>
                  `COD · ${order.paidAt ? "Collected" : "Unpaid"}`,
              },
              {
                key: "total",
                header: "Total",
                align: "right",
                cell: (order) => bdt(order.total),
              },
            ]}
          />
        )}
        {query.currentData?.meta && (
          <div className="p-4">
            <Pagination
              mode="normal"
              paginationInfo={query.currentData.meta}
              onPageChange={setPage}
              onItemsPerPageChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
            />
          </div>
        )}
      </Card>
      {creating && owner && (
        <ManualOrderModal
          key={owner}
          owner={owner}
          open
          onOpenChange={setCreating}
        />
      )}
    </div>
  );
}
