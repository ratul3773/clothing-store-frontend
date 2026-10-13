"use client";

import Link from "next/link";
import { ArrowLeft, Check, Truck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminOrders } from "@/lib/admin-operations-data";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const order = adminOrders.find((item) => item.id === params.id);
  if (!order)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order not found</CardTitle>
          <CardDescription>
            This order is not present in the isolated mock service.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link className={buttonVariants()} href="/admin/orders">
            <ArrowLeft data-icon="inline-start" />
            Back to orders
          </Link>
        </CardContent>
      </Card>
    );
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            className={cn(buttonVariants({ variant: "ghost" }))}
            href="/admin/orders"
          >
            <ArrowLeft data-icon="inline-start" />
            Orders
          </Link>
          <h1 className="mt-3 font-serif text-4xl font-semibold">
            Order #{order.id}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Placed {order.placed} · {order.kind} customer
          </p>
        </div>
        <Button
          onClick={() =>
            toast.info("No courier booking was performed in mock mode.")
          }
        >
          <Truck data-icon="inline-start" />
          Courier action
        </Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <CardTitle>Items and variants</CardTitle>
            <CardDescription>
              Variant-level details for fulfilment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {order.items.map((item) => (
                <div
                  className="flex items-start justify-between border-b border-border pb-4"
                  key={item.variant}
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variant} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ৳{item.price.toLocaleString("en-BD")}
                  </p>
                </div>
              ))}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>৳{order.total.toLocaleString("en-BD")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status overview</CardTitle>
            <CardDescription>
              Order, payment, and delivery are tracked independently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <Badge variant="outline">{order.orderStatus}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <Badge variant="secondary">{order.paymentStatus}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivery</p>
                <Badge variant="outline">{order.deliveryStatus}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">
                  Courier / tracking
                </p>
                <p className="font-medium">
                  {order.courier} · {order.tracking}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Delivery address
                </p>
                <p className="font-medium">{order.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Order timeline</CardTitle>
          <CardDescription>Operational events for #{order.id}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 md:grid-cols-4">
            {[
              "Order placed",
              "Payment recorded",
              "Packed",
              order.orderStatus === "Delivered"
                ? "Delivered"
                : "Awaiting next step",
            ].map((event, index) => (
              <div key={event} className="flex gap-3">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${index < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <Check />
                </span>
                <div>
                  <p className="text-sm font-medium">{event}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {index < 2 ? order.placed : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
