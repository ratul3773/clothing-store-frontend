"use client";

import { Btn } from "@/components/cms/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminComboQuery } from "@/redux/apis/combo.api";
import { apiErrorMessage } from "@/redux/api.utils";
import type { ComboEditorProps } from "../_hooks/useComboSubmit";
import ComboEditor from "./ComboEditor";

type Props = Omit<ComboEditorProps, "original"> & { comboId: string | null };

export default function ComboForm({ comboId, ...editorProps }: Props) {
  const { data, isLoading, error, refetch } = useGetAdminComboQuery(comboId ?? "", { skip: !comboId });
  if (isLoading) return <Skeleton className="h-48" />;
  if (comboId && !data) return <div role="alert"><p>{apiErrorMessage(error)}</p><Btn onClick={() => void refetch()}>Retry combo</Btn></div>;
  return <ComboEditor original={data ?? null} {...editorProps} />;
}
