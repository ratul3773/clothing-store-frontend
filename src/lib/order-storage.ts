import { z } from "zod";
import type {
  CheckoutPayload,
  ManualOrderPayload,
} from "@/redux/apis/types/order.types";

const selectionSchema = z.object({
  owner: z.string(),
  version: z.number().int().nonnegative(),
  lines: z
    .array(
      z.object({ id: z.string().uuid(), type: z.enum(["VARIANT", "COMBO"]) }),
    )
    .min(1)
    .max(50),
});
export type CheckoutHandoff = z.infer<typeof selectionSchema>;
export type OrderAttempt = {
  key: string;
  body: CheckoutPayload | ManualOrderPayload;
};
const guests = new Map<string, string>();
const tokenSchema = z.record(
  z.string().uuid(),
  z.string().regex(/^[A-Za-z0-9_-]{43}$/),
);
const GUESTS = "orders:guest-access";

export const saveCheckoutHandoff = (handoff: CheckoutHandoff) => {
  try {
    sessionStorage.setItem(
      "orders:checkout",
      JSON.stringify(selectionSchema.parse(handoff)),
    );
    return true;
  } catch {
    return false;
  }
};
export const readCheckoutHandoff = (owner: string): CheckoutHandoff | null => {
  try {
    const result = selectionSchema.safeParse(
      JSON.parse(sessionStorage.getItem("orders:checkout") ?? "null"),
    );
    return result.success && result.data.owner === owner ? result.data : null;
  } catch {
    return null;
  }
};
export const clearCheckoutHandoff = () => {
  try {
    sessionStorage.removeItem("orders:checkout");
  } catch {}
};

const attemptKey = (owner: string, manual: boolean) =>
  `orders:attempt:${manual ? "admin" : "checkout"}:${owner}`;
export const readOrderAttempt = (
  owner: string,
  manual: boolean,
): OrderAttempt | null => {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(attemptKey(owner, manual)) ?? "null",
    );
    if (
      !value ||
      typeof value.key !== "string" ||
      !/^[A-Za-z0-9_-]{16,128}$/.test(value.key) ||
      !value.body ||
      !Array.isArray(value.body.lines) ||
      !value.body.expected ||
      !value.body.destination
    )
      return null;
    return value;
  } catch {
    return null;
  }
};
export const saveOrderAttempt = (
  owner: string,
  manual: boolean,
  attempt: OrderAttempt,
) => {
  try {
    sessionStorage.setItem(attemptKey(owner, manual), JSON.stringify(attempt));
    return true;
  } catch {
    return false;
  }
};
export const clearOrderAttempt = (owner: string, manual: boolean) => {
  try {
    sessionStorage.removeItem(attemptKey(owner, manual));
  } catch {}
};

const savedGuests = (): Record<string, string> => {
  try {
    return tokenSchema.parse(JSON.parse(localStorage.getItem(GUESTS) ?? "{}"));
  } catch {
    return {};
  }
};
export const rememberGuestOrder = (id: string, token: string) => {
  if (
    !z.string().uuid().safeParse(id).success ||
    !/^[A-Za-z0-9_-]{43}$/.test(token)
  )
    return false;
  guests.set(id, token);
  try {
    localStorage.setItem(
      GUESTS,
      JSON.stringify({ ...savedGuests(), [id]: token }),
    );
    return true;
  } catch {
    return false;
  }
};
export const guestOrderToken = (id: string): string | null =>
  guests.get(id) ?? savedGuests()[id] ?? null;
export const guestOrderPersisted = (id: string) => !!savedGuests()[id];
export const rememberedGuestOrders = () => [
  ...new Set([...Object.keys(savedGuests()), ...guests.keys()]),
];
export const forgetGuestOrder = (id: string) => {
  guests.delete(id);
  const saved = savedGuests();
  delete saved[id];
  try {
    localStorage.setItem(GUESTS, JSON.stringify(saved));
  } catch {}
};
