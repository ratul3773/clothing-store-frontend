export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/** Returns an error message for an unsupported image, or `null` when valid. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `${file.name}: use a JPEG, PNG, WebP, or AVIF image.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name}: images must be 5 MB or smaller.`;
  }
  return null;
}
