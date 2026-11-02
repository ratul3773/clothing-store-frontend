import type { Combo, ComboComponent, CreateCombo, UpdateCombo } from "@/redux/apis/types/combo.types";

export type ComboDraft = {
  name: string; description: string; price: string; isActive: boolean;
  startsAt: string; endsAt: string; items: ComboComponent[];
};

export const emptyComboDraft = (): ComboDraft => ({ name: "", description: "", price: "", isActive: true, startsAt: "", endsAt: "", items: [] });
export const toDhakaInput = (iso: string | null) => iso ? new Date(Date.parse(iso) + 6 * 60 * 60 * 1000).toISOString().slice(0, 19) : "";
export const fromDhakaInput = (value: string) => value ? new Date(`${value}+06:00`).toISOString() : null;
export const comboDraft = (combo: Combo): ComboDraft => ({
  name: combo.name, description: combo.description ?? "", price: String(combo.price), isActive: combo.isActive,
  startsAt: toDhakaInput(combo.startsAt), endsAt: toDhakaInput(combo.endsAt), items: combo.items,
});

export function validateComboDraft(draft: ComboDraft): string | null {
  if (!draft.name.trim() || draft.name.trim().length > 200) return "Name must contain 1 to 200 characters.";
  if (draft.description.trim().length > 10000) return "Description must not exceed 10,000 characters.";
  const price = Number(draft.price);
  if (!Number.isInteger(price) || price < 1 || price > 2_147_483_647) return "Enter an integer price from 1 to 2,147,483,647 taka.";
  if (draft.items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 3)) return "Each component quantity must be 1 to 3.";
  const pieces = draft.items.reduce((sum, item) => sum + item.quantity, 0);
  if (pieces !== 2 && pieces !== 3) return "A combo must contain two or three physical pieces.";
  if (new Set(draft.items.map((item) => item.variantId)).size !== draft.items.length) return "Combine repeated variants into one quantity.";
  try {
    const start = fromDhakaInput(draft.startsAt), end = fromDhakaInput(draft.endsAt);
    if (start && end && start >= end) return "Start must be before end.";
  } catch { return "Enter valid schedule dates."; }
  return null;
}

export const comboPayload = (draft: ComboDraft): CreateCombo => ({
  name: draft.name.trim(), description: draft.description.trim() || null, price: Number(draft.price), isActive: draft.isActive,
  startsAt: fromDhakaInput(draft.startsAt), endsAt: fromDhakaInput(draft.endsAt),
  items: draft.items.map(({ variantId, quantity }) => ({ variantId, quantity })),
});

const normalizedItems = (items: CreateCombo["items"]) => JSON.stringify([...items].sort((a, b) => a.variantId.localeCompare(b.variantId)));
export function comboChanges(draft: ComboDraft, original: Combo): UpdateCombo {
  const next = comboPayload(draft);
  const previous = comboPayload(comboDraft(original));
  const changes: UpdateCombo = {};
  for (const key of ["name", "description", "price", "isActive", "startsAt", "endsAt"] as const) {
    if (next[key] !== previous[key]) Object.assign(changes, { [key]: next[key] });
  }
  if (normalizedItems(next.items) !== normalizedItems(previous.items)) changes.items = next.items;
  return changes;
}

export function addComboComponent(items: ComboComponent[], component: ComboComponent): ComboComponent[] {
  const existing = items.find((item) => item.variantId === component.variantId);
  return existing ? items.map((item) => item.variantId === component.variantId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, component];
}

export const formatComboDate = (iso: string | null) => iso ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso)) : "No boundary";
