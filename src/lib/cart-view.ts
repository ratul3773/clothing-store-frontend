import type { CartItem } from "@/redux/apis/types/cart.types";

export type CartLineView = CartItem & { selected: boolean };

export function cartErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") return data.message;
  }
  return "Could not update your bag. Check your connection and try again.";
}

export const cartErrorStatus = (error: unknown) =>
  error && typeof error === "object" && "status" in error ? error.status : undefined;
