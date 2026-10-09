export type CategorySlug = "shirts" | "pants";

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export type ProductBadge = "new" | "sale" | "best_seller";

export type FitFeedback = "runs_small" | "true_to_size" | "runs_large";

export interface ProductColor {
  name: string;
  swatch: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  fit: string;
  fabric: string;
  price: number;
  offerPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  unavailableSizes: string[];
  availability: Availability;
  stockLeft?: number;
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  shortDescription: string;
  details: string[];
  specs: ProductSpec[];
  completeLook: string[];
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  nameBn: string;
  description: string;
  image: string;
}

export interface Review {
  id: string;
  productSlug: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  sizePurchased: string;
  fit: FitFeedback;
  images: string[];
}

export interface CartItem {
  key: string;
  slug: string;
  color: string;
  size: string;
  quantity: number;
}

export type OrderStatus =
  "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type PaymentMethod = "cod" | "sslcommerz";

export type PaymentStatus = "paid" | "pending" | "due_on_delivery";

export type DeliveryZone = "inside_dhaka" | "outside_dhaka";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  line: string;
  isDefault: boolean;
}

export interface OrderLine {
  slug: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface TimelineEvent {
  label: string;
  description: string;
  date?: string;
  done: boolean;
}

export type ExchangeStatus =
  | "requested"
  | "approved"
  | "pickup_scheduled"
  | "replacement_shipped"
  | "completed"
  | "rejected";

export interface ExchangeRequest {
  id: string;
  lineSlug: string;
  fromSize: string;
  toSize: string;
  fromColor: string;
  toColor: string;
  reason: string;
  status: ExchangeStatus;
  timeline: TimelineEvent[];
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  zone: DeliveryZone;
  address: Address;
  courier?: string;
  trackingId?: string;
  estimatedDelivery: string;
  deliveredOn?: string;
  timeline: TimelineEvent[];
  exchange?: ExchangeRequest;
}
