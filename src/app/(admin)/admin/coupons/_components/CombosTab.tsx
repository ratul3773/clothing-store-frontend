"use client";

import { CmsButton } from "@/components/ui/button";
import useCombosTab from "../_hooks/useCombosTab";

import DataTable from "@/components/cms/DataTable";
import Modal from "@/components/cms/Modal";
import TableSkeleton from "@/components/cms/TableSkeleton";
import { Card, Empty } from "@/components/cms/ui";
import Pagination from "@/components/common/Pagination";
import { comboDiscountLabel } from "@/lib/combo-pricing";
import { bdt } from "@/lib/utils";
import { apiErrorMessage } from "@/redux/api.utils";
import { Plus } from "lucide-react";
import Image from "next/image";
import { formatComboDate } from "../_utils/combo.utils";
import ComboForm from "./ComboForm";

export default function CombosTab() {
  const {
    setPage,
    setLimit,
    editing,
    setEditing,
    open,
    setOpen,
    setSaving,
    replacement,
    setReplacement,
    ComboData,
    isFetching,
    error,
    refetch,
    updating,
    edit,
    changeOpen,
    toggle,
  } = useCombosTab();
  return (
    <>
      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-border p-3">
          <span className="text-sm">{ComboData?.meta?.total ?? 0} combos</span>
          <Modal
            open={open}
            onOpenChange={changeOpen}
            size="xl"
            trigger={
              <CmsButton
                variant="default"
                onClick={() => {
                  setEditing(null);
                  setReplacement(false);
                }}
              >
                <Plus className="size-4" /> New combo
              </CmsButton>
            }
            title={
              replacement
                ? "Create replacement combo"
                : editing
                  ? "Edit combo"
                  : "New combo"
            }
          >
            <ComboForm
              key={editing ?? "new"}
              onOpenChange={setOpen}
              comboId={editing}
              onPendingChange={setSaving}
              onReplacement={() => setReplacement(true)}
            />
          </Modal>
        </div>
        <p className="p-3 text-xs text-muted-foreground">
          Schedules are shown in Asia/Dhaka. Active status alone does not
          guarantee public visibility. Capacity reflects component inventory.
        </p>
        {error ? (
          <div role="alert" className="p-4">
            <p>{apiErrorMessage(error)}</p>
            <CmsButton variant="outline" onClick={() => refetch()}>Retry combos</CmsButton>
          </div>
        ) : isFetching ? (
          <TableSkeleton columns={8} />
        ) : (
          <DataTable
            rows={ComboData?.items ?? []}
            rowKey={(c) => c.id}
            onRowClick={edit}
            empty={
              <Empty
                title="No combos"
                description="Create a fixed set of two or three pieces."
              />
            }
            columns={[
              {
                key: "name",
                header: "Combo",
                cell: (c) => (
                  <div className="flex items-center gap-3">
                    <Image
                      src={c.imageUrl ?? "/product-placeholder.svg"}
                      alt=""
                      width={40}
                      height={50}
                      className="h-12 w-10 object-cover"
                    />
                    <span className="font-medium">{c.name}</span>
                  </div>
                ),
              },
              {
                key: "items",
                header: "Components",
                cell: (c) => (
                  <ul className="text-xs">
                    {c.items.map((i) => (
                      <li key={i.colorId}>
                        {i.product.name} / {i.color.name} x {i.quantity}
                      </li>
                    ))}
                  </ul>
                ),
              },
              { key: "price", header: "Price", cell: (c) => bdt(c.price) },
              {
                key: "combinedPrice",
                header: "Combined price",
                cell: (c) => bdt(c.combinedPrice),
              },
              {
                key: "savings",
                header: "Savings",
                cell: (c) =>
                  c.savings > 0
                    ? `${bdt(c.savings)} (${comboDiscountLabel(c.discountPercentage)})`
                    : "No current saving",
              },
              {
                key: "active",
                header: "Status",
                cell: (c) => (c.isActive ? "Active" : "Inactive"),
              },
              {
                key: "schedule",
                header: "Schedule (Dhaka)",
                cell: (c) => (
                  <span className="text-xs">
                    Start: {formatComboDate(c.startsAt)}
                    <br />
                    End: {formatComboDate(c.endsAt)}
                  </span>
                ),
              },
              {
                key: "stock",
                header: "Capacity",
                cell: (c) => `Up to ${c.maxQuantity} combos`,
              },
              {
                key: "actions",
                header: "Actions",
                cell: (c) => (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CmsButton variant="outline" onClick={() => edit(c)}>Edit</CmsButton>
                    <CmsButton variant="outline"
                      disabled={updating.isLoading}
                      onClick={() => void toggle(c)}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </CmsButton>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>
      {ComboData?.meta && (
        <Pagination
          mode="normal"
          paginationInfo={ComboData.meta}
          onPageChange={setPage}
          onItemsPerPageChange={(value) => {
            setLimit(value);
            setPage(1);
          }}
          itemsLabel="combos"
        />
      )}
    </>
  );
}
