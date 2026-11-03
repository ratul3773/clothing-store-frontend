"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAdminCombosQuery,
  useUpdateComboMutation,
} from "@/redux/apis/combo.api";
import { apiErrorMessage } from "@/redux/api.utils";
import type { Combo } from "@/redux/apis/types/combo.types";
import { bdt } from "@/lib/utils";
import { Btn, Card, Empty } from "@/components/cms/ui";
import DataTable from "@/components/cms/DataTable";
import Pagination from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatComboDate } from "../_utils/combo.utils";
import ComboForm from "./ComboForm";
import { comboDiscountLabel } from "@/lib/combo-pricing";
import Modal from "@/components/cms/Modal";
import { Plus } from "lucide-react";
import TableSkeleton from "@/components/cms/TableSkeleton";

export default function CombosTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const { 
    data: ComboData, 
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetAdminCombosQuery({ page, limit });
  const [update, updating] = useUpdateComboMutation();
  const edit = (combo: Combo) => {
    setEditing(combo.id);
    setReplacement(false);
    setOpen(true);
  };
  const changeOpen = (value: boolean) => {
    if (!saving) setOpen(value);
  };
  const toggle = async (combo: Combo) => {
    try {
      await update({
        id: combo.id,
        data: { isActive: !combo.isActive },
      }).unwrap();
      toast.success(combo.isActive ? "Combo deactivated" : "Combo activated");
    } catch (failure) {
      toast.error(apiErrorMessage(failure));
    }
  };
  return (
    <>
      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-border p-3">
          <span className="text-sm">
            {ComboData?.meta?.total ?? 0} combos
          </span>
          <Modal
            open={open}
            onOpenChange={changeOpen}
            size="xl"
            trigger={
              <Btn
                variant="primary"
                onClick={() => {
                  setEditing(null);
                  setReplacement(false);
                }}
              >
                <Plus className="size-4" /> New combo
              </Btn>
            }
            title={
              replacement
                ? "Create replacement combo"
                : editing
                  ? "Edit combo"
                  : "New combo"
            }
            children={
              <ComboForm
                key={editing ?? "new"}
                onOpenChange={setOpen}
                comboId={editing}
                onPendingChange={setSaving}
                onReplacement={() => setReplacement(true)}
              />
            }
          />
        </div>
        <p className="p-3 text-xs text-muted-foreground">
          Schedules are shown in Asia/Dhaka. Active status alone does not
          guarantee public visibility. Capacity reflects component inventory.
        </p>
        {error ? (
          <div role="alert" className="p-4">
            <p>{apiErrorMessage(error)}</p>
            <Btn onClick={() => refetch()}>Retry combos</Btn>
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
                    <Btn onClick={() => edit(c)}>Edit</Btn>
                    <Btn
                      disabled={updating.isLoading}
                      onClick={() => void toggle(c)}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </Btn>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>
      {ComboData?.meta && 
      <Pagination 
        mode="normal" 
        paginationInfo={ComboData.meta} 
        onPageChange={setPage} 
        onItemsPerPageChange={(value) => { setLimit(value); setPage(1); }} 
        itemsLabel="combos" 
      />}
    </>
  );
}
