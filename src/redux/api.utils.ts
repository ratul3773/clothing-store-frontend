/** Shared helpers for the `{ success, message, data, meta }` API envelope. */

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type Paged<T> = {
  items: T[];
  meta?: PageMeta;
};

export type ApiEnvelope<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PageMeta;
};

export type ApiErrorBody = {
  success?: false;
  message?: string;
  errorMessages?: Array<{ path?: string; message?: string }>;
};

export const unwrap = <T>(response: ApiEnvelope<T>): T => response.data;

/** For `fetchBaseQuery`'s `transformResponse`, whose input is `unknown`. */
export const unwrapData = <T>(response: unknown): T =>
  unwrap<T>(response as ApiEnvelope<T>);

export const unwrapPaged = <T>(response: unknown): Paged<T> => {
  const envelope = response as ApiEnvelope<T[]>;
  return { items: envelope.data, meta: envelope.meta };
};

const cleanPath = (path?: string) =>
  path?.replace(/^(body|query|params)\./, "").trim();

/**
 * Turns RTK Query / fetch failures into a message that is safe to show in a
 * toast. Mirrors the backend's `errorMessages[].path/message` shape.
 */
export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (typeof error !== "object" || error === null) return fallback;

  const queryError = error as {
    data?: unknown;
    message?: string;
    error?: string;
  };

  if (typeof queryError.data === "object" && queryError.data !== null) {
    const body = queryError.data as ApiErrorBody;
    const first = body.errorMessages?.find((item) => item?.message);
    const path = cleanPath(first?.path);

    if (first?.message) {
      return path ? `${path}: ${first.message}` : first.message;
    }

    if (body.message) return body.message;
  }

  if (typeof queryError.message === "string") return queryError.message;
  if (typeof queryError.error === "string") return queryError.error;

  return fallback;
}

/** True for a 409 from an optimistic-concurrency (`version`) check. */
export const isConflictError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { status?: unknown }).status === 409;
