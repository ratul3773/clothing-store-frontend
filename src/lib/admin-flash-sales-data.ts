import { products } from "@/lib/data/products";
import type { Product } from "@/lib/types";

export type FlashSaleStatus =
  | "Draft"
  | "Scheduled"
  | "Active"
  | "Paused"
  | "Expired"
  | "Cancelled";

export type FlashSaleVariant = {
  color: string;
  size: string;
  salePrice: number;
};

export type FlashSaleItem = {
  productId: string;
  pricingMode: "product" | "variant";
  salePrice: number;
  variants: FlashSaleVariant[];
  quantityLimit?: number;
};

export type FlashSaleCampaign = {
  id: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  status: FlashSaleStatus;
  items: FlashSaleItem[];
  createdAt: string;
  updatedAt: string;
};

export const flashSaleCatalog: Product[] = products;

export const initialFlashSales: FlashSaleCampaign[] = [
  {
    id: "fs-001",
    name: "Weekend Shirt Edit",
    description: "A short offer on everyday cotton shirts.",
    startAt: "2026-10-10T03:00:00.000Z",
    endAt: "2026-10-13T00:00:00.000Z",
    status: "Active",
    items: [
      {
        productId: "p01",
        pricingMode: "product",
        salePrice: 1890,
        variants: [],
        quantityLimit: 30,
      },
      {
        productId: "p02",
        pricingMode: "variant",
        salePrice: 2190,
        variants: [
          { color: "Indigo", size: "M", salePrice: 2190 },
          { color: "Sand", size: "L", salePrice: 2290 },
        ],
      },
    ],
    createdAt: "2026-10-07T06:00:00.000Z",
    updatedAt: "2026-10-09T08:30:00.000Z",
  },
  {
    id: "fs-002",
    name: "Chino Hour",
    description: "Limited-time pricing on selected chinos.",
    startAt: "2026-10-20T04:00:00.000Z",
    endAt: "2026-10-21T18:00:00.000Z",
    status: "Scheduled",
    items: [
      {
        productId: "p07",
        pricingMode: "product",
        salePrice: 2290,
        variants: [],
      },
      {
        productId: "p08",
        pricingMode: "product",
        salePrice: 2390,
        variants: [],
      },
    ],
    createdAt: "2026-10-09T05:20:00.000Z",
    updatedAt: "2026-10-10T03:45:00.000Z",
  },
  {
    id: "fs-003",
    name: "Monsoon Last Call",
    description: "A completed promotion for the monsoon collection.",
    startAt: "2026-09-28T03:00:00.000Z",
    endAt: "2026-10-02T18:00:00.000Z",
    status: "Expired",
    items: [
      {
        productId: "p04",
        pricingMode: "product",
        salePrice: 1790,
        variants: [],
      },
      {
        productId: "p06",
        pricingMode: "product",
        salePrice: 2290,
        variants: [],
      },
    ],
    createdAt: "2026-09-23T04:30:00.000Z",
    updatedAt: "2026-10-02T18:00:00.000Z",
  },
  {
    id: "fs-004",
    name: "Oxford Colours",
    description: "Paused while campaign details are reviewed.",
    startAt: "2026-10-10T03:00:00.000Z",
    endAt: "2026-10-12T18:00:00.000Z",
    status: "Paused",
    items: [
      {
        productId: "p01",
        pricingMode: "product",
        salePrice: 1990,
        variants: [],
      },
    ],
    createdAt: "2026-10-08T09:10:00.000Z",
    updatedAt: "2026-10-10T07:15:00.000Z",
  },
  {
    id: "fs-005",
    name: "Autumn Linen Preview",
    description: "Draft campaign for the next seasonal edit.",
    startAt: "2026-10-25T04:00:00.000Z",
    endAt: "2026-10-26T18:00:00.000Z",
    status: "Draft",
    items: [
      {
        productId: "p03",
        pricingMode: "variant",
        salePrice: 2050,
        variants: [
          { color: "Sand", size: "M", salePrice: 2050 },
          { color: "White", size: "L", salePrice: 2150 },
        ],
      },
    ],
    createdAt: "2026-10-10T09:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
  },
  {
    id: "fs-006",
    name: "Friday Fit Event",
    description: "Cancelled before the scheduled start.",
    startAt: "2026-10-05T04:00:00.000Z",
    endAt: "2026-10-05T18:00:00.000Z",
    status: "Cancelled",
    items: [
      {
        productId: "p08",
        pricingMode: "product",
        salePrice: 2290,
        variants: [],
      },
    ],
    createdAt: "2026-10-01T05:30:00.000Z",
    updatedAt: "2026-10-04T10:30:00.000Z",
  },
];

export function getFlashSaleStatus(
  campaign: FlashSaleCampaign,
  now = Date.now(),
): FlashSaleStatus {
  if (campaign.status === "Cancelled" || campaign.status === "Draft") {
    return campaign.status;
  }

  const startAt = new Date(campaign.startAt).getTime();
  const endAt = new Date(campaign.endAt).getTime();

  if (now >= endAt) return "Expired";
  if (campaign.status === "Paused") return "Paused";
  if (now < startAt) return "Scheduled";
  return "Active";
}

export function getFlashSaleProduct(productId: string) {
  return flashSaleCatalog.find((product) => product.id === productId);
}

export function getFlashSaleSku(productId: string) {
  const index = flashSaleCatalog.findIndex((product) => product.id === productId);
  const product = flashSaleCatalog[index];
  if (!product || index < 0) return undefined;
  return `NEEL-${product.category === "shirts" ? "SHT" : "PNT"}-${String(index + 101)}`;
}

export function getFlashSaleProductStock(productId: string) {
  const index = flashSaleCatalog.findIndex((product) => product.id === productId);
  const product = flashSaleCatalog[index];
  if (!product || index < 0) return 0;
  return product.stockLeft ?? [24, 8, 42, 5, 31, 12][index % 6] ?? 0;
}

export function getEligibleVariants(product: Product) {
  return product.colors.flatMap((color) =>
    product.sizes
      .filter((size) => !product.unavailableSizes.includes(size))
      .map((size) => ({ color: color.name, size })),
  );
}

export function getVariantStock(product: Product, color: string, size: string) {
  const productIndex = flashSaleCatalog.findIndex(
    (catalogProduct) => catalogProduct.id === product.id,
  );
  const colorIndex = product.colors.findIndex((item) => item.name === color);
  const sizeIndex = product.sizes.indexOf(size);
  const stock = [18, 12, 24, 8, 16, 20][
    (productIndex + colorIndex + sizeIndex) % 6
  ];

  if (product.stockLeft !== undefined) {
    return Math.min(stock ?? 1, Math.max(1, product.stockLeft));
  }

  return stock ?? 1;
}

export function formatBDT(value: number) {
  return `৳${Math.round(value).toLocaleString("en-BD")}`;
}

export function getDiscountPercentage(regularPrice: number, salePrice: number) {
  if (regularPrice <= 0 || salePrice <= 0) return 0;
  return Math.round(
    ((regularPrice - salePrice) * 1000) / regularPrice,
  ) / 10;
}
