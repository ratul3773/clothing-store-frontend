"use client";

import { useGetAdminComboQuery } from "@/redux/apis/combo.api";
export default function useComboForm(comboId: string | null) {
  const { data, isLoading, error, refetch } = useGetAdminComboQuery(
    comboId ?? "",
    { skip: !comboId },
  );
  return { data, isLoading, error, refetch };
}
