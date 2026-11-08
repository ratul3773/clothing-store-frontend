"use client";

import { useSearchParams } from "@/lib/nav";
import OrdersList from "../_components/OrdersList";
import OrderDetail from "../_components/OrderDetail";

export default function OrdersRouter() {
  const [sp] = useSearchParams();
  const id = sp.get("id");
  return id ? <OrderDetail id={id} /> : <OrdersList />;
}
