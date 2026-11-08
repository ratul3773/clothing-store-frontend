"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/common/form-field";
import { Btn, Toolbar } from "@/components/cms/ui";
import { ORDER_STATUSES, ORDER_SOURCES, dhakaDateBoundary, orderLabel } from "@/lib/order-rules";
import type { OrderQuery } from "@/redux/apis/types/order.types";

const date = z.union([z.literal(""), z.iso.date()]);
const schema = z.object({ q: z.string().trim().max(100), status: z.enum(["ALL", ...ORDER_STATUSES]),
  source: z.enum(["ALL", ...ORDER_SOURCES]), from: date, to: date })
  .refine((values) => !values.from || !values.to || values.from <= values.to, { message: "End date must follow start date", path: ["to"] });
const empty = { q: "", status: "ALL" as const, source: "ALL" as const, from: "", to: "" };

export default function OrdersFilters({ onChange }: { onChange: (query: OrderQuery) => void }) {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: empty });
  return <form noValidate onSubmit={form.handleSubmit((values) => onChange({
    ...(values.q ? { q: values.q } : {}), ...(values.status !== "ALL" ? { status: values.status } : {}), ...(values.source !== "ALL" ? { source: values.source } : {}),
    ...(values.from ? { from: dhakaDateBoundary(values.from) } : {}), ...(values.to ? { to: dhakaDateBoundary(values.to, true) } : {}),
  }))}><Toolbar>
    <FormField form={form} id="orders-search" name="q" label="Search" placeholder="Order number, name or phone" isInput />
    <FormField form={form} id="orders-status" name="status" label="Status" isSelect options={[{ value: "ALL", label: "All statuses" }, ...ORDER_STATUSES.map((value) => ({ value, label: orderLabel(value) }))]} />
    <FormField form={form} id="orders-source" name="source" label="Source" isSelect options={[{ value: "ALL", label: "All sources" }, ...ORDER_SOURCES.map((value) => ({ value, label: orderLabel(value) }))]} />
    <FormField form={form} id="orders-from" name="from" label="From (Dhaka)" type="date" isInput />
    <FormField form={form} id="orders-to" name="to" label="To (Dhaka)" type="date" isInput />
    <div className="flex items-end gap-2"><Btn type="submit">Apply filters</Btn><Btn onClick={() => { form.reset(empty); onChange({}); }}>Clear</Btn></div>
  </Toolbar></form>;
}
