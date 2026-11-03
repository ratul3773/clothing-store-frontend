export const toDhakaInput = (iso: string | null) =>
  iso
    ? new Date(Date.parse(iso) + 6 * 60 * 60 * 1000).toISOString().slice(0, 19)
    : "";
export const fromDhakaInput = (value: string) =>
  value ? new Date(`${value}+06:00`).toISOString() : null;
