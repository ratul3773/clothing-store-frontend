"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import Modal from "@/components/cms/Modal";
import { Btn, Field, Input, Textarea } from "@/components/cms/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminComboQuery, useCreateComboMutation, useUpdateComboMutation } from "@/redux/apis/combo.api";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";
import type { Combo } from "@/redux/apis/types/combo.types";
import { addComboComponent, comboChanges, comboDraft, comboPayload, emptyComboDraft, validateComboDraft, type ComboDraft } from "../_utils/combo.utils";
import ComboColorPicker from "./ComboColorPicker";
import { bdt } from "@/lib/utils";
import { comboDraftPricing, comboDiscountLabel } from "@/lib/combo-pricing";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; comboId: string | null };
export default function ComboForm({ open, onOpenChange, comboId }: Props) {
  return open ? <LoadEditor key={comboId ?? "new"} onOpenChange={onOpenChange} comboId={comboId} /> : null;
}

function LoadEditor({ onOpenChange, comboId }: Omit<Props, "open">) {
  const { data, isLoading, error, refetch } = useGetAdminComboQuery(comboId ?? "", { skip: !comboId });
  if (isLoading) return <Modal open onOpenChange={onOpenChange} title="Edit combo">
    <Skeleton className="h-48" />
  </Modal>;
  if (comboId && !data) return <Modal open onOpenChange={onOpenChange} title="Edit combo">
    <div role="alert"><p>{apiErrorMessage(error)}</p><Btn onClick={() => void refetch()}>Retry combo</Btn></div>
  </Modal>;
  return <Editor original={data ?? null} onOpenChange={onOpenChange} />;
}

function Editor({ original, onOpenChange }: { original: Combo | null; onOpenChange: Props["onOpenChange"] }) {
  const [baseline, setBaseline] = useState(original);
  const [draft, setDraft] = useState<ComboDraft>(() => original ? comboDraft(original) : emptyComboDraft());
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const [create, creating] = useCreateComboMutation();
  const [update, updating] = useUpdateComboMutation();
  const pending = useRef(false);
  const busy = creating.isLoading || updating.isLoading;
  const set = <K extends keyof ComboDraft>(key: K, value: ComboDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const changes = baseline ? comboChangesSafely(draft, baseline) : null;
  const pieces = draft.items.reduce((sum, item) => sum + item.quantity, 0);
  const pricing = comboDraftPricing(draft.items, Number(draft.price));
  const priceTooHigh = pieces >= 2 && Number(draft.price) >= pricing.combinedPrice;
  const submit = async () => {
    if (pending.current) return;
    const validation = validateComboDraft(draft);
    if (validation) { setError(validation); return; }
    pending.current = true;
    setError("");
    try {
      if (baseline && !replacement) {
        const data = comboChanges(draft, baseline);
        if (!Object.keys(data).length) return;
        await update({ id: baseline.id, data }).unwrap();
      } else await create(comboPayload(draft)).unwrap();
      toast.success(baseline && !replacement ? "Combo updated" : "Combo created");
      onOpenChange(false);
    } catch (failure) {
      setError(apiErrorMessage(failure));
      setConflict(!!baseline && !replacement && isConflictError(failure));
    } finally { pending.current = false; }
  };
  const deactivate = async () => {
    if (!baseline || pending.current) return;
    pending.current = true;
    try {
      const saved = await update({ id: baseline.id, data: { isActive: false } }).unwrap();
      setBaseline(saved);
      setDraft((d) => ({ ...d, isActive: false }));
      toast.success("Existing combo deactivated. Your draft is preserved.");
    } catch (failure) { setError(apiErrorMessage(failure)); }
    finally { pending.current = false; }
  };
  return <Modal open onOpenChange={(open) => { if (!pending.current) onOpenChange(open); }} size="xl" title={replacement ? "Create replacement combo" : baseline ? "Edit combo" : "New combo"} footer={<><Btn disabled={busy} onClick={() => onOpenChange(false)}>Cancel</Btn><Btn variant="primary" disabled={busy || (!!baseline && !replacement && changes !== null && !Object.keys(changes).length)} onClick={() => void submit()}>{busy ? "Saving..." : replacement ? "Save replacement" : "Save combo"}</Btn></>}>
    <fieldset disabled={busy} className="min-w-0 space-y-4">
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {conflict && !replacement && <div className="space-y-2 rounded border border-border p-3 text-sm">
        <p>Cart-referenced contents cannot change, including references in expired guest carts awaiting cleanup. Your draft is preserved. Deactivation and replacement are separate actions.</p>
        <div className="flex flex-wrap gap-2"><Btn disabled={!baseline?.isActive} onClick={() => void deactivate()}>Deactivate existing combo</Btn><Btn onClick={() => { setReplacement(true); setError(""); }}>Create replacement from draft</Btn></div>
      </div>}
      {replacement && <p role="status" className="text-sm">Saving creates a new combo. The original is unchanged unless you deactivated it. Review the active setting below.</p>}
      <Field label="Name"><Input maxLength={200} value={draft.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Description"><Textarea maxLength={10000} value={draft.description} onChange={(e) => set("description", e.target.value)} /></Field>
      <Field label="Combo price (BDT taka)" error={priceTooHigh ? "Must be lower than the combined item price." : undefined}><Input type="number" min={1} max={2147483647} step={1} value={draft.price} onChange={(e) => set("price", e.target.value)} aria-invalid={priceTooHigh} /></Field>
      {draft.items.length > 0 && <div className="rounded border border-border bg-muted p-3 text-sm" aria-live="polite">
        <p>Combined item price: <strong>{bdt(pricing.combinedPrice)}</strong></p>
        <p className="mt-1 text-xs text-muted-foreground">Includes quantities and current product offers.</p>
        {Number(draft.price) > 0 && pricing.savings > 0 && <p className="mt-2 text-success">Save {bdt(pricing.savings)} ({comboDiscountLabel(pricing.discountPercentage)})</p>}
      </div>}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.isActive} onChange={(e) => set("isActive", e.target.checked)} />Active</label>
      <p className="text-xs text-muted-foreground">Active combos also need an eligible schedule and publicly available components to appear in the shop.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Starts at - Asia/Dhaka (UTC+06:00)" hint="Inclusive; blank means no start boundary"><Input type="datetime-local" step={1} value={draft.startsAt} onChange={(e) => set("startsAt", e.target.value)} /></Field>
        <Field label="Ends at - Asia/Dhaka (UTC+06:00)" hint="Exclusive; blank means no end boundary"><Input type="datetime-local" step={1} value={draft.endsAt} onChange={(e) => set("endsAt", e.target.value)} /></Field>
      </div>
      <h3 className="text-sm font-semibold">Selected pieces ({pieces} / 3)</h3>
      {!draft.items.length && <p className="text-sm text-muted-foreground">Select products and colors below. Sizes are chosen by the customer. A combo needs two or three physical pieces.</p>}
      <ul className="space-y-3">{draft.items.map((item) => <li key={item.colorId} className="flex flex-wrap items-center gap-3 rounded border border-border p-2">
        <Image src={item.product.imageUrl ?? "/product-placeholder.svg"} alt="" width={40} height={50} className="h-12 w-10 object-cover" />
        <span className="min-w-0 flex-1 text-sm">{item.product.name}<span className="block text-xs text-muted-foreground">{item.color.name} / {bdt(item.product.unitPrice)} each</span></span>
        <Field label="Quantity"><Input type="number" className="w-20" min={1} max={3} value={item.quantity} onChange={(e) => set("items", draft.items.map((entry) => entry.colorId === item.colorId ? { ...entry, quantity: Number(e.target.value) } : entry))} /></Field>
        <Btn aria-label={`Remove ${item.product.name} ${item.color.name}`} onClick={() => set("items", draft.items.filter((entry) => entry.colorId !== item.colorId))}>Remove</Btn>
      </li>)}</ul>
      <ComboColorPicker disabled={busy || pieces >= 3} onAdd={(item) => setDraft((d) => ({ ...d, items: addComboComponent(d.items, item) }))} />
    </fieldset>
  </Modal>;
}

function comboChangesSafely(draft: ComboDraft, original: Combo) {
  try { return comboChanges(draft, original); } catch { return null; }
}
