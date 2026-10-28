"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, History } from "lucide-react";
import { useForm } from "react-hook-form";

import Modal from "@/components/cms/Modal";
import { Badge, Btn, Empty } from "@/components/cms/ui";
import { useStore } from "@/components/providers/StoreProvider";
import { apiErrorMessage } from "@/redux/api.utils";
import {
  useAdjustStockMutation,
  useGetStockMovementsQuery,
} from "@/redux/apis/product.api";
import type {
  AdminVariant,
  StockAdjustmentPayload,
} from "@/redux/apis/types/product.types";
import { cn } from "@/lib/utils";

import { STOCK_TYPE_OPTIONS } from "../_constants/products.constants";
import {
  stockAdjustmentFormSchema,
  type StockAdjustmentFormValues,
} from "../_schemas/product.schema";
import { formatDate, variantName } from "../_utils/products.utils";
import { SelectField, TextareaField, TextField } from "../../_components/form-controls";

type Props = {
  productId: string;
  variant: AdminVariant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const emptyValues: StockAdjustmentFormValues = {
  type: "RESTOCK",
  quantity: "",
  onHand: "",
  note: "",
};

export default function StockAdjustDialog({
  productId,
  variant,
  open,
  onOpenChange,
}: Props) {
  const { toast, toastError } = useStore();
  const [tab, setTab] = useState<"adjust" | "history">("adjust");
  const [historyPage, setHistoryPage] = useState(1);
  const [adjustStock, adjustState] = useAdjustStockMutation();

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentFormSchema),
    defaultValues: emptyValues,
  });

  const type = form.watch("type");

  useEffect(() => {
    if (!open) return;
    form.reset(emptyValues);
    setTab("adjust");
    setHistoryPage(1);
  }, [open, form, variant.id]);

  const { data: history, isFetching: historyLoading } =
    useGetStockMovementsQuery(
      { productId, variantId: variant.id, page: historyPage, limit: 10 },
      { skip: !open || tab !== "history" },
    );

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: StockAdjustmentPayload = {
      type: values.type,
      note: values.note.trim() === "" ? null : values.note.trim(),
    };

    if (values.type === "STOCKTAKE") {
      payload.onHand = Number(values.onHand);
    } else {
      payload.quantity = Number(values.quantity);
    }

    try {
      await adjustStock({ productId, variantId: variant.id, data: payload }).unwrap();
      toast("Stock updated.");
      form.reset(emptyValues);
      onOpenChange(false);
    } catch (error) {
      toastError(apiErrorMessage(error, "Stock could not be adjusted."));
    }
  });

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Stock · ${variantName(variant)}`}
      description={variant.sku}
      size="lg"
      footer={
        tab === "adjust" ? (
          <>
            <Btn onClick={() => onOpenChange(false)}>Cancel</Btn>
            <Btn
              type="submit"
              form="stock-adjust-form"
              variant="primary"
              disabled={adjustState.isLoading}
            >
              {adjustState.isLoading ? "Saving…" : "Apply adjustment"}
            </Btn>
          </>
        ) : (
          <Btn onClick={() => onOpenChange(false)}>Close</Btn>
        )
      }
    >
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="On hand" value={variant.onHand} />
        <Stat label="Reserved" value={variant.reserved} />
        <Stat label="Available" value={variant.available} />
        <Stat label="Low at" value={variant.lowStockThreshold} />
      </div>

      <div className="mb-4 flex gap-1 rounded-md border border-border p-1">
        <TabButton
          active={tab === "adjust"}
          onClick={() => setTab("adjust")}
          icon={<Boxes className="size-3.5" />}
        >
          Adjust
        </TabButton>
        <TabButton
          active={tab === "history"}
          onClick={() => setTab("history")}
          icon={<History className="size-3.5" />}
        >
          History
        </TabButton>
      </div>

      {tab === "adjust" ? (
        <form id="stock-adjust-form" onSubmit={onSubmit} className="space-y-4">
          <SelectField
            form={form}
            name="type"
            label="Adjustment type"
            options={STOCK_TYPE_OPTIONS}
          />

          {type === "STOCKTAKE" ? (
            <TextField
              form={form}
              name="onHand"
              label="Counted stock"
              inputMode="numeric"
              placeholder="e.g. 42"
              hint="The variant on-hand count is replaced with this number."
            />
          ) : (
            <TextField
              form={form}
              name="quantity"
              label={type === "ADJUSTMENT" ? "Change (+/−)" : "Quantity"}
              inputMode="numeric"
              placeholder={type === "ADJUSTMENT" ? "e.g. -2 or 5" : "e.g. 10"}
              hint={
                type === "DAMAGED"
                  ? "This amount is removed from stock."
                  : type === "ADJUSTMENT"
                    ? "Use a negative number to reduce stock."
                    : undefined
              }
            />
          )}

          <TextareaField
            form={form}
            name="note"
            label="Note"
            rows={2}
            placeholder="Optional reason or reference"
          />
        </form>
      ) : (
        <div>
          {historyLoading && !history ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading movement history…
            </p>
          ) : !history || history.items.length === 0 ? (
            <Empty
              title="No stock movements"
              description="Adjustments for this variant will appear here."
            />
          ) : (
            <div className="overflow-x-auto rounded border border-border">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 text-right font-medium">Change</th>
                    <th className="px-3 py-2 text-right font-medium">On hand</th>
                    <th className="px-3 py-2 font-medium">Note</th>
                    <th className="px-3 py-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {history.items.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2">
                        <Badge tone="gray">{movement.type}</Badge>
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right tabular-nums",
                          movement.onHandDelta < 0 && "text-red-600",
                          movement.onHandDelta > 0 && "text-emerald-600",
                        )}
                      >
                        {movement.onHandDelta > 0 ? "+" : ""}
                        {movement.onHandDelta}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {movement.onHandAfter}
                      </td>
                      <td className="max-w-48 truncate px-3 py-2 text-muted-foreground">
                        {movement.note ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {formatDate(movement.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {history && history.meta && history.meta.totalPage > 1 && (
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Page {history.meta.page} of {history.meta.totalPage}
              </span>
              <div className="flex gap-1">
                <Btn
                  size="sm"
                  disabled={history.meta.page <= 1}
                  onClick={() => setHistoryPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </Btn>
                <Btn
                  size="sm"
                  disabled={history.meta.page >= history.meta.totalPage}
                  onClick={() => setHistoryPage((page) => page + 1)}
                >
                  Next
                </Btn>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-border bg-muted/40 px-3 py-2">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      {icon}
      {children}
    </button>
  );
}
