type CartMergeAdjustment = {
  reason: "STOCK_CAP" | "UNAVAILABLE" | "LINE_LIMIT";
  requestedQuantity: number;
  retainedQuantity: number;
};

function isAdjustment(value: unknown): value is CartMergeAdjustment {
  if (!value || typeof value !== "object") return false;
  const adjustment = value as Record<string, unknown>;
  return (adjustment.reason === "STOCK_CAP" || adjustment.reason === "UNAVAILABLE" || adjustment.reason === "LINE_LIMIT")
    && Number.isSafeInteger(adjustment.requestedQuantity)
    && Number.isSafeInteger(adjustment.retainedQuantity);
}

function readMerge(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const direct = record.cartMerge;
  if (direct && typeof direct === "object") return direct as Record<string, unknown>;
  const data = record.data;
  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).cartMerge;
    if (nested && typeof nested === "object") return nested as Record<string, unknown>;
  }
  return null;
}

export function cartMergeNotice(value: unknown): string | null {
  const merge = readMerge(value);
  if (!merge || merge.merged !== true || !Array.isArray(merge.adjustments)) return null;
  if (!merge.adjustments.every(isAdjustment)) return null;
  const adjustments = merge.adjustments;
  if (!adjustments.length) return "Your guest bag was added to your account bag.";
  const reduced = adjustments.filter((item) => item.reason === "STOCK_CAP").length;
  const unavailable = adjustments.filter((item) => item.reason === "UNAVAILABLE").length;
  const limited = adjustments.filter((item) => item.reason === "LINE_LIMIT").length;
  const details = [
    reduced ? `${reduced} item${reduced === 1 ? "" : "s"} reduced to available stock` : "",
    unavailable ? `${unavailable} unavailable item${unavailable === 1 ? "" : "s"} skipped` : "",
    limited ? `${limited} item${limited === 1 ? "" : "s"} skipped because your bag has reached its 50-line limit` : "",
  ].filter(Boolean).join(" and ");
  return `Your guest bag was added to your account bag; ${details}.`;
}
