"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useGetAdminCombosQuery, useUpdateComboMutation } from "@/redux/apis/combo.api";
import { apiErrorMessage } from "@/redux/api.utils";
import type { Combo } from "@/redux/apis/types/combo.types";
import { bdt } from "@/lib/utils";
import { Btn, Card, Empty } from "@/components/cms/ui";
import DataTable from "@/components/cms/DataTable";
import Pagination from "@/components/common/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatComboDate } from "../_utils/combo.utils";
import ComboForm from "./ComboForm";

export default function CombosTab() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const query = useGetAdminCombosQuery({ page, limit });
  const [update, updating] = useUpdateComboMutation();
  const edit = (combo: Combo) => { setEditing(combo.id); setOpen(true); };
  const toggle = async (combo: Combo) => {
    try { await update({ id: combo.id, data: { isActive: !combo.isActive } }).unwrap(); toast.success(combo.isActive ? "Combo deactivated" : "Combo activated"); }
    catch (failure) { toast.error(apiErrorMessage(failure)); }
  };
  return <>
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-border p-3"><span className="text-sm">{query.currentData?.meta?.total ?? 0} combos</span><Btn variant="primary" onClick={() => { setEditing(null); setOpen(true); }}>New combo</Btn></div>
      <p className="p-3 text-xs text-muted-foreground">Schedules are shown in Asia/Dhaka. Active status alone does not guarantee public visibility. Capacity reflects component inventory.</p>
      {query.isError ? <div role="alert" className="p-4"><p>{apiErrorMessage(query.error)}</p><Btn onClick={() => void query.refetch()}>Retry combos</Btn></div> : query.isFetching ? <Skeleton className="m-3 h-48" /> : <DataTable rows={query.currentData?.items ?? []} rowKey={(c) => c.id} onRowClick={edit} empty={<Empty title="No combos" description="Create a fixed set of two or three pieces." />} columns={[
        { key: "name", header: "Combo", cell: (c) => <div className="flex items-center gap-3"><Image src={c.imageUrl ?? "/product-placeholder.svg"} alt="" width={40} height={50} className="h-12 w-10 object-cover" /><span className="font-medium">{c.name}</span></div> },
        { key: "items", header: "Components", cell: (c) => <ul className="text-xs">{c.items.map((i) => <li key={i.variantId}>{i.product.name} / {i.variant.color} / {i.variant.size} x {i.quantity}</li>)}</ul> },
        { key: "price", header: "Price", cell: (c) => bdt(c.price) },
        { key: "active", header: "Status", cell: (c) => c.isActive ? "Active" : "Inactive" },
        { key: "schedule", header: "Schedule (Dhaka)", cell: (c) => <span className="text-xs">Start: {formatComboDate(c.startsAt)}<br />End: {formatComboDate(c.endsAt)}</span> },
        { key: "stock", header: "Capacity", cell: (c) => `${c.maxQuantity} combos` },
        { key: "actions", header: "Actions", cell: (c) => <div className="flex gap-2" onClick={(e) => e.stopPropagation()}><Btn onClick={() => edit(c)}>Edit</Btn><Btn disabled={updating.isLoading} onClick={() => void toggle(c)}>{c.isActive ? "Deactivate" : "Activate"}</Btn></div> },
      ]} />}
    </Card>
    {query.currentData?.meta && <Pagination paginationInfo={query.currentData.meta} onPageChange={setPage} onItemsPerPageChange={(value) => { setLimit(value); setPage(1); }} itemsLabel="combos" />}
    <ComboForm open={open} onOpenChange={setOpen} comboId={editing} />
  </>;
}
