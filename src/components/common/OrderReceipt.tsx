"use client";

import { bdt } from "@/lib/utils";
import Image from "next/image";
import { orderLabel } from "@/lib/order-rules";
import type {
  OrderDisplay,
  OrderReceipt as Receipt,
} from "@/redux/apis/types/order.types";

export default function OrderReceipt({
  order,
  printable = false,
}: {
  order: OrderDisplay | Receipt;
  printable?: boolean;
}) {
  return (
    <div id={printable ? "order-invoice" : undefined} className="space-y-6">
      {printable && <style>{`@media print { body * { visibility: hidden !important; } #order-invoice, #order-invoice * { visibility: visible !important; } #order-invoice { position: absolute; left: 0; top: 0; width: 100%; padding: 24px; background: white; color: black; } }`}</style>}
      {"number" in order && (
        <div className="flex flex-wrap justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-semibold">Receipt {order.number}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString("en-GB")}
            </p>
          </div>
          <div className="text-sm">
            <p>{orderLabel(order.status)}</p>
            <p>COD · {order.paidAt ? "Collected" : "Unpaid"}</p>
          </div>
        </div>
      )}
      <ul className="divide-y divide-border" aria-label="Order items">
        {order.lines.map((line) => (
          <li key={line.id} className="py-4 first:pt-0">
            <div className="flex justify-between gap-3">
              <Image src={line.imageUrl ?? line.components.find((item) => item.imageUrl)?.imageUrl ?? "/product-placeholder.svg"} alt={line.name} width={48} height={60} className="h-15 w-12 shrink-0 rounded bg-muted object-cover" onError={(event) => { event.currentTarget.src = "/product-placeholder.svg"; }} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {line.name}
                  {line.type === "COMBO" ? " · Combo" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  {line.quantity} × {bdt(line.unitPrice)}
                </p>
              </div>
              <strong className="shrink-0">{bdt(line.quantity * line.unitPrice)}</strong>
            </div>
            <ul
              className="mt-2 space-y-1 text-sm text-muted-foreground"
              aria-label="Included physical pieces"
            >
              {line.components.map((component) => (
                <li key={component.id} className="flex items-center gap-2">
                  {line.type === "COMBO" && <Image src={component.imageUrl ?? "/product-placeholder.svg"} alt={component.productName} width={32} height={40} className="h-10 w-8 shrink-0 rounded bg-muted object-cover" onError={(event) => { event.currentTarget.src = "/product-placeholder.svg"; }} />}
                  <span>
                  {component.productName} · {component.color} / {component.size}{" "}
                  × {component.quantity}
                  {!!(
                    (component.returnedSellable ?? 0) +
                    (component.returnedDamaged ?? 0)
                  ) && (
                    <span>
                      {" "}
                      · Received: {component.returnedSellable} sellable,{" "}
                      {component.returnedDamaged} damaged
                    </span>
                  )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{bdt(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Discount</dt>
          <dd>−{bdt(order.discount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd>{bdt(order.deliveryFee)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold">
          <dt>
            {"paidAt" in order && order.paidAt
              ? "Total collected"
              : "status" in order && ["CANCELLED", "DELIVERY_FAILED", "RETURNED"].includes(order.status) ? "Order total" : "Total due on delivery"}
          </dt>
          <dd>{bdt(order.total)}</dd>
        </div>
      </dl>
      <div className="border-t border-border pt-4 text-sm">
        <h3 className="font-semibold">Deliver to</h3>
        <p>
          {order.recipientName} · {order.recipientPhone}
        </p>
        <p>
          {order.addressLine}, {order.area}, {order.district}
          {order.postalCode ? `, ${order.postalCode}` : ""}
        </p>
        {"note" in order && order.note && (
          <p className="mt-2">Note: {order.note}</p>
        )}
      </div>
    </div>
  );
}
