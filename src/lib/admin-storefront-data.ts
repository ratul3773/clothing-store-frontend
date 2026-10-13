export type PublicationStatus = "Draft" | "Scheduled" | "Published";
export type CMSRecord = {
  id: string;
  title: string;
  status: PublicationStatus;
  updated: string;
  owner: string;
};
export const cmsPages: CMSRecord[] = [
  {
    id: "home",
    title: "Homepage",
    status: "Published",
    updated: "Today, 09:42",
    owner: "Nadia Rahman",
  },
  {
    id: "about",
    title: "About NEEL",
    status: "Published",
    updated: "12 Sep 2026",
    owner: "Nadia Rahman",
  },
  {
    id: "returns",
    title: "Returns & exchanges policy",
    status: "Draft",
    updated: "Yesterday",
    owner: "Arif Hasan",
  },
  {
    id: "privacy",
    title: "Privacy policy",
    status: "Published",
    updated: "02 Aug 2026",
    owner: "Arif Hasan",
  },
];
export const banners: CMSRecord[] = [
  {
    id: "bn-1",
    title: "Monsoon tailoring edit",
    status: "Published",
    updated: "Today, 08:10",
    owner: "Nadia Rahman",
  },
  {
    id: "bn-2",
    title: "Free delivery over ৳5,000",
    status: "Scheduled",
    updated: "Starts 18 Oct 2026",
    owner: "Arif Hasan",
  },
  {
    id: "bn-3",
    title: "New arrivals: Autumn 2026",
    status: "Draft",
    updated: "15 Oct 2026",
    owner: "Nadia Rahman",
  },
];
export const coupons = [
  {
    id: "NEEL10",
    type: "Percentage",
    value: "10%",
    uses: 82,
    status: "Active",
    ends: "31 Oct 2026",
  },
  {
    id: "WELCOME500",
    type: "Fixed amount",
    value: "৳500",
    uses: 214,
    status: "Active",
    ends: "30 Nov 2026",
  },
  {
    id: "EID26",
    type: "Percentage",
    value: "15%",
    uses: 0,
    status: "Scheduled",
    ends: "07 Apr 2027",
  },
];
export const promotions = [
  {
    id: "promo-1",
    title: "Monsoon edit",
    type: "Collection discount",
    value: "12% off",
    status: "Published",
    dates: "01–31 Oct 2026",
  },
  {
    id: "promo-2",
    title: "Second shirt, half price",
    type: "Buy more save more",
    value: "50% off",
    status: "Draft",
    dates: "Not scheduled",
  },
];
export const bundles = [
  {
    id: "bundle-1",
    title: "The smart casual set",
    products: 3,
    price: 6200,
    compareAt: 7100,
    status: "Published",
  },
  {
    id: "bundle-2",
    title: "Weekend essentials",
    products: 4,
    price: 8450,
    compareAt: 9800,
    status: "Draft",
  },
];
export const looks = [
  {
    id: "look-1",
    title: "Linen shirt + tapered chinos",
    products: 2,
    status: "Published",
    clicks: 642,
  },
  {
    id: "look-2",
    title: "Oxford shirt + suede loafers",
    products: 3,
    status: "Draft",
    clicks: 0,
  },
];
export const reviews = [
  {
    id: "rv-1",
    customer: "Tanvir Ahmed",
    product: "Navy Oxford Shirt",
    rating: 5,
    text: "The fit is excellent and the fabric feels premium.",
    status: "Pending",
    date: "16 Oct 2026",
  },
  {
    id: "rv-2",
    customer: "Sadia Karim",
    product: "Stone Chinos",
    rating: 4,
    text: "Great cut, slightly long for me.",
    status: "Published",
    date: "15 Oct 2026",
  },
  {
    id: "rv-3",
    customer: "Guest customer",
    product: "Leather Loafers",
    rating: 2,
    text: "Packaging arrived damaged.",
    status: "Flagged",
    date: "14 Oct 2026",
  },
];
export const analytics = {
  revenue: 1284500,
  orders: 286,
  aov: 4491,
  conversion: 3.8,
  series: [82000, 115000, 98000, 143000, 126000, 181000, 163000],
};
export const notifications = [
  {
    id: "nt-1",
    title: "Low stock threshold reached",
    body: "Navy Oxford Shirt · Large has 4 units remaining.",
    channel: "Admin alert",
    enabled: true,
  },
  {
    id: "nt-2",
    title: "Order delivered",
    body: "Notify customers when a courier confirms delivery.",
    channel: "Email",
    enabled: true,
  },
  {
    id: "nt-3",
    title: "Review reminder",
    body: "Send 5 days after a delivered order.",
    channel: "Email",
    enabled: false,
  },
];
export const storeSettings = {
  storeName: "NEEL",
  currency: "BDT (৳)",
  timezone: "Asia/Dhaka",
  deliveryInsideDhaka: 80,
  deliveryOutsideDhaka: 140,
  freeDeliveryThreshold: 5000,
  reviewModeration: true,
  lowStockThreshold: 10,
};
export const cmsService = {
  list: async (records: CMSRecord[]) => records,
  save: async <T>(record: T) => record,
  publish: async (id: string) => ({ id, status: "Published" as const }),
};
