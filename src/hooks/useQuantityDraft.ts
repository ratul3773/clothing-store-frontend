"use client";

import { useCallback, useState } from "react";

/** Component-local edit. Changing identity/variant/saved value resets the draft. */
export default function useQuantityDraft(key: string, saved: number) {
  const [draft, setDraft] = useState({ key, saved, quantity: saved });
  const matches = draft.key === key && draft.saved === saved;
  if (!matches) setDraft({ key, saved, quantity: saved });
  const quantity = matches ? draft.quantity : saved;
  const setQuantity = useCallback((value: number) => {
    if (Number.isInteger(value) && value >= 1 && value <= 10) setDraft({ key, saved, quantity: value });
  }, [key, saved]);
  return { quantity, setQuantity, changed: quantity !== saved };
}