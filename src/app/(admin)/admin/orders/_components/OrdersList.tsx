"use client";

import useOrdersList from "../_hooks/useOrdersList";

import DataTable from "@/components/cms/DataTable";
import StatusBadge from "@/components/cms/StatusBadge";
import { Card, PageHeader } from "@/components/cms/ui";
import Pagination from "@/components/common/Pagination";
import { CmsButton } from "@/components/ui/button";
import { orderLabel } from "@/lib/order-rules";
import { bdt } from "@/lib/utils";
import { apiErrorMessage } from "@/redux/api.utils";
import { Plus } from "lucide-react";
import ManualOrderModal from "./ManualOrderModal";
import OrdersFilters from "./OrdersFilters";

export default function OrdersList() {
  const { session, router, setFilters, setPage, limit, setLimit, creating, setCreating, owner, query } = useOrdersList();
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
