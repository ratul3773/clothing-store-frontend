import type { DeliveryZone } from "@/lib/types";

export const BRAND = {
  name: "NEEL",
  nameBn: "নীল",
  tagline: "Menswear, made in Bangladesh",
  phone: "+880 1711-200300",
  whatsapp: "+880 1711-200300",
  email: "care@neel.com.bd",
  address: "House 42, Road 11, Banani, Dhaka 1213",
  hours: "Sat–Thu, 10 am – 8 pm",
};

export const DELIVERY: Record<
  DeliveryZone,
  { label: string; labelBn: string; fee: number; eta: string }
> = {
  inside_dhaka: {
    label: "Inside Dhaka",
    labelBn: "ঢাকার ভিতরে",
    fee: 70,
    eta: "1–2 working days",
  },
  outside_dhaka: {
    label: "Outside Dhaka",
    labelBn: "ঢাকার বাইরে",
    fee: 130,
    eta: "3–5 working days",
  },
};

export const FREE_DELIVERY_THRESHOLD = 5000;

export const EXCHANGE_POLICY = {
  windowDays: 7,
  maxExchangesPerItem: 1,
  rules: [
    "Request within 7 days of delivery",
    "Unworn, unwashed, with original tags attached",
    "One size or colour exchange per item",
    "Sale items can be exchanged for size only",
  ],
};

export interface Coupon {
  code: string;
  description: string;
  type: "percent" | "flat";
  value: number;
  minSubtotal: number;
}

export const COUPONS: Coupon[] = [
  {
    code: "NEEL10",
    description: "10% off your order",
    type: "percent",
    value: 10,
    minSubtotal: 0,
  },
  {
    code: "WELCOME300",
    description: "৳300 off orders above ৳3,000",
    type: "flat",
    value: 300,
    minSubtotal: 3000,
  },
];

export const PRICE_RANGE = { min: 0, max: 5000, step: 250 };
