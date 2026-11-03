"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Btn } from "@/components/cms/ui";
import { SwitchField, TextareaField, TextField } from "../../_components/form-controls";
import { comboDraft, emptyComboDraft, type ComboDraft } from "../_utils/combo.utils";
import { comboFormSchema } from "../_schemas/combo.schema";
import useComboSubmit, { type ComboEditorProps } from "../_hooks/useComboSubmit";
import ComboConflictNotice from "./ComboConflictNotice";
import ComboPricingSummary from "./ComboPricingSummary";
import ComboItemsList from "./ComboItemsList";

export default function ComboEditor(props: ComboEditorProps) {
  const form = useForm<ComboDraft>({ resolver: zodResolver(comboFormSchema), defaultValues: props.original ? comboDraft(props.original) : emptyComboDraft() });
  const items = useWatch({ control: form.control, name: "items", defaultValue: form.getValues("items") });
  const price = useWatch({ control: form.control, name: "price", defaultValue: form.getValues("price") });
  const { baseline, conflict, replacement, busy, submit, deactivate, beginReplacement } = useComboSubmit(form, props);
  const error = form.formState.errors.root?.server?.message;
  return <form onSubmit={(event) => void form.handleSubmit(submit)(event)} noValidate aria-busy={busy}>
    <fieldset disabled={busy} className="min-w-0 space-y-4">
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {conflict && !replacement && <ComboConflictNotice active={!!baseline?.isActive} onDeactivate={() => void deactivate()} onReplacement={beginReplacement} />}
      {replacement && <p role="status" className="text-sm">Saving creates a new combo. The original is unchanged unless you deactivated it. Review the active setting below.</p>}
      <TextField form={form} name="name" label="Name" maxLength={200} />
      <TextareaField form={form} name="description" label="Description" maxLength={10000} />
      <TextField form={form} name="price" label="Combo price (BDT taka)" type="number" min={1} max={2147483647} step={1} />
      <ComboPricingSummary items={items} price={price} />
      <SwitchField form={form} name="isActive" label="Active" description="Active combos also need an eligible schedule and publicly available components to appear in the shop." />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField form={form} name="startsAt" label="Starts at - Asia/Dhaka (UTC+06:00)" hint="Inclusive; blank means no start boundary" type="datetime-local" step={1} />
        <TextField form={form} name="endsAt" label="Ends at - Asia/Dhaka (UTC+06:00)" hint="Exclusive; blank means no end boundary" type="datetime-local" step={1} />
      </div>
      <ComboItemsList form={form} busy={busy} />
    </fieldset>
    <div className="sticky -bottom-4 -mx-5 -mb-4 mt-4 flex justify-end gap-2 border-t border-border bg-card px-5 py-3">
      <Btn disabled={busy} onClick={() => props.onOpenChange(false)}>Cancel</Btn>
      <Btn type="submit" variant="primary" disabled={busy || (!!baseline && !replacement && !form.formState.isDirty)}>{busy ? "Saving..." : replacement ? "Save replacement" : "Save combo"}</Btn>
    </div>
  </form>;
}
