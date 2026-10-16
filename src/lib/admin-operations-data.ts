export type OrderStatus =
  "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";
export type DeliveryStatus =
  "Awaiting pickup" | "In transit" | "Delivered" | "Exception";

export const adminOrders = [
  {
    id: "NE-10482",
    customer: "Aarav Rahman",
    email: "aarav@example.com",
    kind: "Registered",
    total: 2490,
    orderStatus: "Processing" as OrderStatus,
    paymentStatus: "Paid" as PaymentStatus,
    deliveryStatus: "Awaiting pickup" as DeliveryStatus,
    courier: "Pathao",
    tracking: "PT-884201",
    placed: "Today, 10:42 AM",
    address: "Gulshan 1, Dhaka",
    items: [
      {
        name: "Indigo Linen Shirt",
        variant: "M / Indigo",
        quantity: 1,
        price: 2490,
      },
    ],
  },
  {
    id: "NE-10481",
    customer: "Nabila Chowdhury",
    email: "nabila@example.com",
    kind: "Guest",
    total: 3280,
    orderStatus: "Shipped" as OrderStatus,
    paymentStatus: "Paid" as PaymentStatus,
    deliveryStatus: "In transit" as DeliveryStatus,
    courier: "RedX",
    tracking: "RX-731920",
    placed: "Today, 9:18 AM",
    address: "Banani, Dhaka",
    items: [
      {
        name: "Stone Pleat Trouser",
        variant: "32 / Stone",
        quantity: 1,
        price: 3280,
      },
    ],
  },
  {
    id: "NE-10480",
    customer: "Rafi Hasan",
    email: "rafi@example.com",
    kind: "Registered",
    total: 4680,
    orderStatus: "Delivered" as OrderStatus,
    paymentStatus: "Paid" as PaymentStatus,
    deliveryStatus: "Delivered" as DeliveryStatus,
    courier: "Steadfast",
    tracking: "SF-410833",
    placed: "Yesterday, 4:25 PM",
    address: "Dhanmondi, Dhaka",
    items: [
      {
        name: "Camp Collar Set",
        variant: "L / Olive",
        quantity: 1,
        price: 4680,
      },
    ],
  },
  {
    id: "NE-10479",
    customer: "Samia Islam",
    email: "samia@example.com",
    kind: "Guest",
    total: 2250,
    orderStatus: "Processing" as OrderStatus,
    paymentStatus: "Pending" as PaymentStatus,
    deliveryStatus: "Awaiting pickup" as DeliveryStatus,
    courier: "Unassigned",
    tracking: "—",
    placed: "Yesterday, 2:12 PM",
    address: "Uttara, Dhaka",
    items: [
      {
        name: "Black Oxford Shirt",
        variant: "L / Black",
        quantity: 1,
        price: 2250,
      },
    ],
  },
];

export const adminCustomers = [
  {
    id: "CUS-104",
    name: "Aarav Rahman",
    email: "aarav@example.com",
    kind: "Registered",
    orders: 8,
    spent: 28640,
    lastOrder: "Today",
  },
  {
    id: "CUS-103",
    name: "Nabila Chowdhury",
    email: "nabila@example.com",
    kind: "Guest",
    orders: 1,
    spent: 3280,
    lastOrder: "Today",
  },
  {
    id: "CUS-102",
    name: "Rafi Hasan",
    email: "rafi@example.com",
    kind: "Registered",
    orders: 12,
    spent: 49280,
    lastOrder: "Yesterday",
  },
  {
    id: "CUS-101",
    name: "Samia Islam",
    email: "samia@example.com",
    kind: "Guest",
    orders: 1,
    spent: 2250,
    lastOrder: "Yesterday",
  },
];

export const adminExchanges = [
  {
    id: "EX-204",
    order: "NE-10471",
    customer: "Mahir Kabir",
    reason: "Size exchange",
    requested: "Today",
    status: "Awaiting review",
    item: "Relaxed Chino / 32 / Sand",
    stockAvailable: true,
  },
  {
    id: "EX-203",
    order: "NE-10454",
    customer: "Tania Noor",
    reason: "Colour exchange",
    requested: "Yesterday",
    status: "Approved",
    item: "Indigo Linen Shirt / M / Indigo",
    stockAvailable: true,
  },
  {
    id: "EX-202",
    order: "NE-10438",
    customer: "Fahim Zaman",
    reason: "Size exchange",
    requested: "2 days ago",
    status: "Stock unavailable",
    item: "Stone Pleat Trouser / 30 / Stone",
    stockAvailable: false,
  },
];
export const adminRefunds = [
  {
    id: "RF-088",
    order: "NE-10439",
    customer: "Lamia Sultana",
    amount: 2490,
    method: "bKash",
    status: "Approved",
    date: "Today, 11:03 AM",
  },
  {
    id: "RF-087",
    order: "NE-10411",
    customer: "Nayeem Hasan",
    amount: 3280,
    method: "Card",
    status: "Pending review",
    date: "Yesterday",
  },
  {
    id: "RF-086",
    order: "NE-10398",
    customer: "Maliha Rahman",
    amount: 890,
    method: "Cash on delivery",
    status: "Completed",
    date: "12 Jun 2025",
  },
];
export const adminPayments = adminOrders.map((order) => ({
  id: `PAY-${order.id.slice(-3)}`,
  order: order.id,
  customer: order.customer,
  amount: order.total,
  method: order.id === "NE-10482" ? "bKash" : "Card",
  status: order.paymentStatus,
  created: order.placed,
}));
export const adminShipments = adminOrders.map((order) => ({
  order: order.id,
  customer: order.customer,
  courier: order.courier,
  tracking: order.tracking,
  status: order.deliveryStatus,
  expected: order.deliveryStatus === "Delivered" ? "Delivered" : "18 Jun 2025",
  charge: order.id === "NE-10482" ? 80 : 120,
}));

export const operationsService = {
  listOrders: async () => adminOrders,
  listCustomers: async () => adminCustomers,
  listExchanges: async () => adminExchanges,
  listRefunds: async () => adminRefunds,
  listPayments: async () => adminPayments,
  listShipments: async () => adminShipments,
};
