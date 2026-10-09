import type { Review } from "@/lib/types";

/**
 * Placeholder review fixtures for layout and state design only.
 * Replace with verified reviews from the reviews API before launch.
 */
const templates: Omit<Review, "id" | "productSlug">[] = [
  {
    author: "Tanvir H.",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    title: "Fabric is better than expected",
    body: "Ordered my usual size and it fit exactly as the chart said. The fabric feels substantial and it held up well after three washes. Delivery came the next day.",
    date: "2026-09-28",
    verified: true,
    sizePurchased: "L",
    fit: "true_to_size",
    images: ["/images/p-indigo-linen-model.png"],
  },
  {
    author: "Rafiul I.",
    location: "Agrabad, Chattogram",
    rating: 4,
    title: "Good fit, slightly long sleeves",
    body: "Overall very happy. Shoulders sit right. The sleeves are a touch long for me but nothing a quick roll doesn't fix. Would order another colour.",
    date: "2026-09-14",
    verified: true,
    sizePurchased: "M",
    fit: "runs_large",
    images: [],
  },
  {
    author: "Sakib A.",
    location: "Uttara, Dhaka",
    rating: 5,
    title: "Exchanged size easily",
    body: "First order was a size too small. The exchange was picked up from my home and the new one arrived in two days. Fits perfectly now.",
    date: "2026-08-30",
    verified: true,
    sizePurchased: "XL",
    fit: "runs_small",
    images: [],
  },
  {
    author: "Imran K.",
    location: "Sylhet",
    rating: 4,
    title: "Clean finishing",
    body: "Stitching is neat and buttons feel solid. Colour matches the photos. Took four days to reach Sylhet which was as quoted at checkout.",
    date: "2026-08-12",
    verified: false,
    sizePurchased: "L",
    fit: "true_to_size",
    images: [],
  },
];

export function getReviews(productSlug: string): Review[] {
  if (productSlug === "utility-cargo-pant") return [];
  return templates.map((review, index) => ({
    ...review,
    id: `${productSlug}-r${index}`,
    productSlug,
    sizePurchased:
      productSlug.includes("chino") ||
      productSlug.includes("trouser") ||
      productSlug.includes("jean")
        ? ["32", "34", "32", "36"][index]
        : review.sizePurchased,
  }));
}

export function getRatingDistribution(rating: number, count: number) {
  const weights =
    rating >= 4.7
      ? [0.78, 0.15, 0.04, 0.02, 0.01]
      : rating >= 4.5
        ? [0.66, 0.22, 0.07, 0.03, 0.02]
        : [0.55, 0.26, 0.11, 0.05, 0.03];
  return [5, 4, 3, 2, 1].map((stars, i) => ({
    stars,
    count: Math.round(count * weights[i]),
  }));
}
