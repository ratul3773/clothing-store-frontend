"use client";

import { useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useCreateComboMutation, useUpdateComboMutation } from "@/redux/apis/combo.api";
import { apiErrorMessage, isConflictError } from "@/redux/api.utils";
import type { Combo } from "@/redux/apis/types/combo.types";
import { comboChanges, comboPayload, type ComboDraft } from "../_utils/combo.utils";

export type ComboEditorProps = {
  original: Combo | null;
  onOpenChange: (open: boolean) => void;
  onPendingChange: (pending: boolean) => void;
  onReplacement: () => void;
};

export default function useComboSubmit(form: UseFormReturn<ComboDraft>, { original, onOpenChange, onPendingChange, onReplacement }: ComboEditorProps) {
  const [baseline, setBaseline] = useState(original);
  const [conflict, setConflict] = useState(false);
  const [replacement, setReplacement] = useState(false);
  const [create, creating] = useCreateComboMutation();
  const [update, updating] = useUpdateComboMutation();
  const pending = useRef(false);
  const busy = form.formState.isSubmitting || creating.isLoading || updating.isLoading;
  const submit = async (values: ComboDraft) => {
    if (pending.current) return;
    pending.current = true;
    onPendingChange(true);
    form.clearErrors("root");
    try {
      if (baseline && !replacement) {
        const data = comboChanges(values, baseline);
        if (!Object.keys(data).length) return;
        await update({ id: baseline.id, data }).unwrap();
      } else await create(comboPayload(values)).unwrap();
      toast.success(baseline && !replacement ? "Combo updated" : "Combo created");
      onOpenChange(false);
    } catch (failure) {
      form.setError("root.server", { message: apiErrorMessage(failure) });
      setConflict(!!baseline && !replacement && isConflictError(failure));
    } finally { pending.current = false; onPendingChange(false); }
  };
  const deactivate = async () => {
    if (!baseline || pending.current) return;
    pending.current = true;
    onPendingChange(true);
    try {
      const saved = await update({ id: baseline.id, data: { isActive: false } }).unwrap();
      setBaseline(saved);
      form.setValue("isActive", false, { shouldDirty: true });
      toast.success("Existing combo deactivated. Your draft is preserved.");
    } catch (failure) { form.setError("root.server", { message: apiErrorMessage(failure) }); }
    finally { pending.current = false; onPendingChange(false); }
  };
  const beginReplacement = () => { setReplacement(true); form.clearErrors(); onReplacement(); };
  return { baseline, conflict, replacement, busy, submit, deactivate, beginReplacement };
}
