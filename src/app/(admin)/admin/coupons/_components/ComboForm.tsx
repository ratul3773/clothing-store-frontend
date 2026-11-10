"use client";

import { CmsButton } from "@/components/ui/button";
import useComboForm from "../_hooks/useComboForm";


import { apiErrorMessage } from "@/redux/api.utils";
import type { ComboEditorProps } from "../_hooks/useComboSubmit";
import ComboEditor from "./ComboEditor";
import ComboFormSkeleton from "./ComboFormSkeleton";

type Props = Omit<ComboEditorProps, "original"> & { comboId: string | null };

export default function ComboForm({ comboId, ...editorProps }: Props) {
  const { data, isLoading, error, refetch } = useComboForm(comboId);
  if (isLoading) return <ComboFormSkeleton />;
  if (comboId && !data)
    return (
      <div role="alert">
        <p>{apiErrorMessage(error)}</p>
        <CmsButton variant="outline" onClick={() => void refetch()}>Retry combo</CmsButton>
      </div>
    );
  return <ComboEditor original={data ?? null} {...editorProps} />;
}
