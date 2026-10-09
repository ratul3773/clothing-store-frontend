const bdtFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** BDT with lakh grouping, e.g. ৳1,25,000 */
export function formatBDT(amount: number) {
  const sign = amount < 0 ? "−" : "";
  return `${sign}৳${bdtFormatter.format(Math.abs(Math.round(amount)))}`;
}

export function discountPercent(price: number, offerPrice?: number) {
  if (!offerPrice || offerPrice >= price) return 0;
  return Math.round(((price - offerPrice) / price) * 100);
}

/** Accepts 01XXXXXXXXX, 8801XXXXXXXXX or +8801XXXXXXXXX */
export const BD_PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export function normalizeBDPhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function formatBDPhone(value: string) {
  const digits = normalizeBDPhone(value).replace(/^\+?88/, "");
  if (digits.length !== 11) return value;
  return `+880 ${digits.slice(1, 5)}-${digits.slice(5)}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}
