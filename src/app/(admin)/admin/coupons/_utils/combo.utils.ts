import type {
  Combo,
  ComboComponent,
  CreateCombo,
  UpdateCombo,
} from "@/redux/apis/types/combo.types";
import { comboFormSchema } from "../_schemas/combo.schema";
import { toDhakaInput, fromDhakaInput } from "./combo-dates";
export { toDhakaInput, fromDhakaInput } from "./combo-dates";

export type ComboDraft = {
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  items: ComboComponent[];
};

export const emptyComboDraft = (): ComboDraft => ({
  name: "",
  description: "",
  price: "",
  isActive: true,
  startsAt: "",
  endsAt: "",
  items: [],
});
export const comboDraft = (combo: Combo): ComboDraft => ({
  name: combo.name,
  description: combo.description ?? "",
  price: String(combo.price),
  isActive: combo.isActive,
  startsAt: toDhakaInput(combo.startsAt),
  endsAt: toDhakaInput(combo.endsAt),
  items: combo.items,
});

export function validateComboDraft(draft: ComboDraft): string | null {
  const result = comboFormSchema.safeParse(draft);
  return result.success
    ? null
    : (result.error.issues[0]?.message ?? "Invalid combo.");
}

export const comboPayload = (draft: ComboDraft): CreateCombo => ({
  name: draft.name.trim(),
  description: draft.description.trim() || null,
  price: Number(draft.price),
  isActive: draft.isActive,
  startsAt: fromDhakaInput(draft.startsAt),
  endsAt: fromDhakaInput(draft.endsAt),
  items: draft.items.map(({ colorId, quantity, variantIds }) => ({ colorId, quantity, variantIds: variantIds ? [...variantIds].sort() : null })),
});

const normalizedItems = (items: CreateCombo["items"]) =>
  JSON.stringify([...items].sort((a, b) => a.colorId.localeCompare(b.colorId)));
export function comboChanges(draft: ComboDraft, original: Combo): UpdateCombo {
  const next = comboPayload(draft);
  const previous = comboPayload(comboDraft(original));
  const changes: UpdateCombo = {};
  if (next.name !== previous.name) changes.name = next.name;
  if (next.description !== previous.description)
    changes.description = next.description;
  if (next.price !== previous.price) changes.price = next.price;
  if (next.isActive !== previous.isActive) changes.isActive = next.isActive;
  if (next.startsAt !== previous.startsAt) changes.startsAt = next.startsAt;
  if (next.endsAt !== previous.endsAt) changes.endsAt = next.endsAt;
  if (normalizedItems(next.items) !== normalizedItems(previous.items))
    changes.items = next.items;
  return changes;
}

export function addComboComponent(
  items: ComboComponent[],
  component: ComboComponent,
): ComboComponent[] {
  const existing = items.find((item) => item.colorId === component.colorId);
  return existing
    ? items.map((item) =>
        item.colorId === component.colorId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
    : [...items, component];
}

export const formatComboDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso))
    : "No boundary";
