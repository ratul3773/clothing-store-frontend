export const adminKpis = [
  {
    label: "Gross revenue",
    value: "৳1,284,650",
    change: "+18.4%",
    trend: "up",
    note: "vs. last month",
  },
  {
    label: "Orders",
    value: "1,248",
    change: "+12.8%",
    trend: "up",
    note: "vs. last month",
  },
  {
    label: "Average order",
    value: "৳2,490",
    change: "+6.2%",
    trend: "up",
    note: "vs. last month",
  },
  {
    label: "Conversion rate",
    value: "3.84%",
    change: "−0.4%",
    trend: "down",
    note: "vs. last month",
  },
] as const;

export const salesData = [
  { month: "Jan", revenue: 186000, orders: 146 },
  { month: "Feb", revenue: 214000, orders: 168 },
  { month: "Mar", revenue: 198000, orders: 156 },
  { month: "Apr", revenue: 246000, orders: 188 },
  { month: "May", revenue: 218000, orders: 172 },
  { month: "Jun", revenue: 292650, orders: 218 },
];

export const recentOrders = [
  {
    id: "#NE-10482",
    customer: "Aarav Rahman",
    item: "Indigo Linen Shirt",
    total: "৳2,490",
    status: "Processing",
    time: "8 min ago",
  },
  {
    id: "#NE-10481",
    customer: "Nabila Chowdhury",
    item: "Stone Pleat Trouser",
    total: "৳3,280",
    status: "Shipped",
    time: "24 min ago",
  },
  {
    id: "#NE-10480",
    customer: "Rafi Hasan",
    item: "Camp Collar Set",
    total: "৳4,680",
    status: "Delivered",
    time: "41 min ago",
  },
  {
    id: "#NE-10479",
    customer: "Samia Islam",
    item: "Black Oxford Shirt",
    total: "৳2,250",
    status: "Processing",
    time: "1 hr ago",
  },
  {
    id: "#NE-10478",
    customer: "Tahmid Ahmed",
    item: "Relaxed Chino",
    total: "৳2,890",
    status: "Cancelled",
    time: "2 hrs ago",
  },
] as const;

export const lowStockItems = [
  {
    name: "Indigo Linen Shirt",
    variant: "M / Indigo",
    stock: 4,
    threshold: 10,
  },
  { name: "Relaxed Chino", variant: "32 / Sand", stock: 7, threshold: 12 },
  { name: "Black Oxford Shirt", variant: "L / Black", stock: 9, threshold: 12 },
];

export const operations = [
  {
    label: "Pending fulfilment",
    value: "24",
    detail: "Orders awaiting packing",
    tone: "warning",
  },
  {
    label: "Returns to review",
    value: "8",
    detail: "Within the last 7 days",
    tone: "info",
  },
  {
    label: "Open support tickets",
    value: "12",
    detail: "3 marked urgent",
    tone: "destructive",
  },
];
