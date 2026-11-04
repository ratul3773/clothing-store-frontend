import type { CartItem } from "@/redux/apis/types/cart.types";
import { apiErrorMessage } from "@/redux/api.utils";

export type CartLineView = CartItem & { selected: boolean };

export function cartErrorMessage(error: unknown) {
  const status = cartErrorStatus(error);
  if (status === "TIMEOUT_ERROR") return "Your bag request took too long to confirm. Reload your bag before trying again.";
  if (status === "FETCH_ERROR") return "We could not confirm your bag. Reload it before trying again.";
  if (error && typeof error === "object" && "name" in error && error.name === "AbortError") return "Your bag request was cancelled. Reload your bag before trying again.";
  if (error instanceof Error) return error.message;
  return apiErrorMessage(error, "Could not update your bag. Check your connection and try again.");
}

export const cartErrorStatus = (error: unknown) =>
  error && typeof error === "object" && "status" in error ? error.status : undefined;
