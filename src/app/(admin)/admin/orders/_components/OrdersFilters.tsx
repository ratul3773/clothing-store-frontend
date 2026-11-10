
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, SlidersHorizontal, RotateCcw, Filter } from "lucide-react";

import { FormField } from "@/components/common/form-field";

import {
  ORDER_STATUSES,
  ORDER_SOURCES,
  dhakaDateBoundary,
  orderLabel,
} from "@/lib/order-rules";
import type { OrderQuery } from "@/redux/apis/types/order.types";
import { CmsButton } from "@/components/ui/button";

const date = z.union([z.literal(""), z.iso.date()]);

const schema = z
  .object({
    q: z.string().trim().max(100),
    status: z.enum(["ALL", ...ORDER_STATUSES]),
    source: z.enum(["ALL", ...ORDER_SOURCES]),
    from: date,
    to: date,
  })
  .refine(
    (values) =>
      !values.from || !values.to || values.from <= values.to,
    {
      message: "End date must follow start date",
      path: ["to"],
    },
  );

type FilterValues = z.infer<typeof schema>;

const empty: FilterValues = {
  q: "",
  status: "ALL",
  source: "ALL",
  from: "",
  to: "",
};

export default function OrdersFilters({
  onChange,
}: {
  onChange: (query: OrderQuery) => void;
}) {
  const form = useForm<FilterValues>({
    resolver: zodResolver(schema),
    defaultValues: empty,
  });

  const values = form.watch();

  const activeFilterCount = [
    values.q.trim().length > 0,
    values.status !== "ALL",
    values.source !== "ALL",
    Boolean(values.from),
    Boolean(values.to),
  ].filter(Boolean).length;

  const handleApply = (values: FilterValues) => {
    onChange({
      ...(values.q.trim() ? { q: values.q.trim() } : {}),
      ...(values.status !== "ALL"
        ? { status: values.status }
        : {}),
      ...(values.source !== "ALL"
        ? { source: values.source }
        : {}),
      ...(values.from
        ? { from: dhakaDateBoundary(values.from) }
        : {}),
      ...(values.to
        ? { to: dhakaDateBoundary(values.to, true) }
        : {}),
    });
  };

  const handleClear = () => {
    form.reset(empty);
    onChange({});
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60">
            <SlidersHorizontal className="size-4 text-foreground" />
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight">
              Filter orders
            </h2>
            <p className="text-xs text-muted-foreground">
              Find orders by details, status, source, or date.
            </p>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            {activeFilterCount} selected
          </span>
        )}
      </div>

      <form
        noValidate
        onSubmit={form.handleSubmit(handleApply)}
        className="p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-5">
          {/* Search */}
          <div className="min-w-0 lg:col-span-3">
            <FormField
              form={form}
              id="orders-search"
              name="q"
              label="Search orders"
              placeholder="Order number, customer or phone"
              isInput
              isAdmin
            />
          </div>

          {/* Status */}
            <FormField
              form={form}
              id="orders-status"
              name="status"
              label="Order status"
              isSelect
              isAdmin
              options={[
                {
                  value: "ALL",
                  label: "All statuses",
                },
                ...ORDER_STATUSES.map((value) => ({
                  value,
                  label: orderLabel(value),
                })),
              ]}
            />

          {/* Source */}
            <FormField
              form={form}
              id="orders-source"
              name="source"
              label="Order source"
              isSelect
              isAdmin
              options={[
                {
                  value: "ALL",
                  label: "All sources",
                },
                ...ORDER_SOURCES.map((value) => ({
                  value,
                  label: orderLabel(value),
                })),
              ]}
            />

          {/* From date */}
          <div className="flex">
            <FormField
              form={form}
              id="orders-from"
              name="from"
              label="From date"
              type="date"
              isInput
              isAdmin
            />
            <FormField
              form={form}
              id="orders-to"
              name="to"
              label="To date"
              type="date"
              isInput
              isAdmin
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-end gap-2 sm:col-span-2 lg:col-span-6 lg:justify-end">
            <CmsButton
              type="button"
              variant="outline"
              onClick={handleClear}
            >
              <RotateCcw className="mr-2 size-3.5" />
              Reset
            </CmsButton>

            <CmsButton type="submit">
              <Filter className="mr-2 size-3.5" />
              Apply filters
            </CmsButton>
          </div>
        </div>
      </form>
    </section>
  );
}
