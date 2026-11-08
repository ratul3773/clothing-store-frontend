"use client";

import useStockAdjustDialog, { type Props } from "../_hooks/useStockAdjustDialog";

import { Boxes, History } from "lucide-react";

import Modal from "@/components/cms/Modal";
import { Badge, Btn, Empty } from "@/components/cms/ui";
import { cn } from "@/lib/utils";

import { Swirling } from "@/components/animation/swirling";
import { TextShimmerWave } from "@/components/animation/text-shimmer";
import { FormField } from "@/components/common/form-field";
import { STOCK_TYPE_OPTIONS } from "../_constants/products.constants";
import { formatDate, variantName } from "../_utils/products.utils";

export default function StockAdjustDialog(props: Props) {
  return props.open ? <StockAdjustDialogContent key={props.variant.id} {...props} /> : null;
}

function StockAdjustDialogContent({
  productId,
  variant,
  open,
  onOpenChange,
}: Props) {
  const { tab, setTab, setHistoryPage, adjustState, form, type, history, historyLoading, onSubmit } = useStockAdjustDialog({
    productId,
    variant,
    open,
    onOpenChange,
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
          <FormField isAdmin isSelect id="type" form={form}
            name="type"
            label="Adjustment type"
            options={STOCK_TYPE_OPTIONS} />

          {type === "STOCKTAKE" ? (
            <FormField isAdmin isInput id="onHand" form={form}
              name="onHand"
              label="Counted stock"
              inputMode="numeric"
              placeholder="e.g. 42"
              description="The variant on-hand count is replaced with this number." />
          ) : (
            <FormField isAdmin isInput id="quantity" form={form}
              name="quantity"
              label={type === "ADJUSTMENT" ? "Change (+/−)" : "Quantity"}
              inputMode="numeric"
              placeholder={type === "ADJUSTMENT" ? "e.g. -2 or 5" : "e.g. 10"}
              description={
                type === "DAMAGED"
                  ? "This amount is removed from stock."
                  : type === "ADJUSTMENT"
                    ? "Use a negative number to reduce stock."
                    : undefined
              } />
          )}

          <FormField isAdmin isTextArea id="note" form={form}
            name="note"
            label="Note"
            rows={2}
            placeholder="Optional reason or reference" />
        </form>
      ) : (
        <div>
          {historyLoading && !history ? (
            <div className="py-5 text-center">
              <Swirling className="size-12 text-accent mx-auto mb-1" />
              <TextShimmerWave className="text-primary label-mono">
                Loading stock movements...
              </TextShimmerWave>
            </div>
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
                    <th className="px-3 py-2 text-right font-medium">
                      On hand
                    </th>
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
                  onClick={() =>
                    setHistoryPage((page) => Math.max(1, page - 1))
                  }
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
