"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Search,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  adminCustomers,
  adminExchanges,
  adminOrders,
  adminPayments,
  adminRefunds,
  adminShipments,
  type OrderStatus,
} from "@/lib/admin-operations-data";
import { cn } from "@/lib/utils";

type Mode =
  "orders" | "customers" | "exchanges" | "refunds" | "payments" | "shipping";

function Heading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Operations
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <Badge
      variant={
        /[Delivered|Paid|Approved|Completed|Shipped]/.test(value)
          ? "secondary"
          : /Failed|Exception|unavailable|Cancelled/.test(value)
            ? "destructive"
            : "outline"
      }
    >
      {value}
    </Badge>
  );
}
function Money({ value }: { value: number }) {
  return <>৳{value.toLocaleString("en-BD")}</>;
}

export function OperationsPage({ mode }: { mode: Mode }) {
  if (mode === "orders") return <Orders />;
  if (mode === "customers") return <Customers />;
  if (mode === "exchanges") return <Exchanges />;
  if (mode === "refunds") return <Refunds />;
  if (mode === "payments") return <Payments />;
  return <Shipping />;
}

function Orders() {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<
    (typeof adminOrders)[number] | null
  >(null);
  const [status, setStatus] = React.useState("all");
  const filtered = adminOrders.filter(
    (order) =>
      (status === "all" || order.orderStatus === status) &&
      `${order.id} ${order.customer} ${order.email}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Orders"
        description="Review guest and registered customer orders across order, payment, and delivery states."
        action={
          <Button
            variant="outline"
            onClick={() =>
              toast.info(
                "Order export is available when a backend service is connected.",
              )
            }
          >
            Export orders
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All orders</CardTitle>
              <CardDescription>
                {filtered.length} orders in the isolated operations service.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search order or customer"
                />
              </div>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value ?? "all")}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {[
                    "Processing",
                    "Packed",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Order status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        className="font-semibold hover:underline"
                        href={`/admin/orders/${order.id}`}
                      >
                        #{order.id}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {order.placed}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.kind} · {order.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Money value={order.total} />
                    </TableCell>
                    <TableCell>
                      <Status value={order.orderStatus} />
                    </TableCell>
                    <TableCell>
                      <Status value={order.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <Status value={order.deliveryStatus} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${order.id}`}
                        onClick={() => setSelected(order)}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No orders match your filters.
            </p>
          )}
        </CardContent>
      </Card>
      <OrderDialog order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function OrderDialog({
  order,
  onClose,
}: {
  order: (typeof adminOrders)[number] | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order timeline {order && `· #${order.id}`}</DialogTitle>
          <DialogDescription>
            Order details are read from the replaceable mock operations service.
          </DialogDescription>
        </DialogHeader>
        {order && (
          <div className="flex flex-col gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="font-medium">{order.customer}</p>
                <p className="text-xs text-muted-foreground">{order.kind}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivery</p>
                <Status value={order.deliveryStatus} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracking</p>
                <p className="font-medium">{order.tracking}</p>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4">
              {[
                "Order placed",
                "Payment recorded",
                "Packed for dispatch",
                order.orderStatus === "Delivered"
                  ? "Delivered"
                  : "Awaiting next operation",
              ].map((item, index) => (
                <div className="flex items-center gap-3" key={item}>
                  <span
                    className={cn(
                      "grid size-7 place-items-center rounded-full",
                      index < 2
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Check />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item}</p>
                    <p className="text-xs text-muted-foreground">
                      {index < 2 ? order.placed : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div>
              <p className="mb-3 text-sm font-semibold">Items and variants</p>
              {order.items.map((item) => (
                <div
                  className="flex justify-between border-b border-border py-3 text-sm"
                  key={item.variant}
                >
                  <span>
                    {item.name}
                    <span className="ml-2 text-muted-foreground">
                      {item.variant} × {item.quantity}
                    </span>
                  </span>
                  <Money value={item.price} />
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <Money value={order.total} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() =>
              toast.info("No courier action was performed in mock mode.")
            }
          >
            Courier action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Customers() {
  const [query, setQuery] = React.useState("");
  const list = adminCustomers.filter((item) =>
    `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Customers"
        description="Understand guest and registered customer activity without mixing their account states."
      />
      <Card>
        <CardHeader>
          <CardTitle>Customer directory</CardTitle>
          <CardDescription>{list.length} customers</CardDescription>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Lifetime value</TableHead>
                  <TableHead>Last order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.kind === "Registered"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {customer.kind}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.orders}</TableCell>
                    <TableCell>
                      <Money value={customer.spent} />
                    </TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Exchanges() {
  const [rows, setRows] = React.useState(adminExchanges);
  const [selected, setSelected] = React.useState<
    (typeof adminExchanges)[number] | null
  >(null);
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Exchanges"
        description="Validate requested variants against available stock before approving an exchange."
      />
      <Card>
        <CardHeader>
          <CardTitle>Exchange requests</CardTitle>
          <CardDescription>
            Stock validation is shown per requested variant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Item / variant</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium">{row.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.order} · {row.customer}
                    </p>
                  </TableCell>
                  <TableCell>{row.item}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>
                    {row.stockAvailable ? (
                      <Badge variant="secondary">Available</Badge>
                    ) : (
                      <Badge variant="destructive">Unavailable</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Status value={row.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        !row.stockAvailable || row.status === "Approved"
                      }
                      onClick={() => setSelected(row)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDialog
        title="Approve exchange?"
        description={
          selected
            ? `Approve ${selected.id} for ${selected.item}? This reserves the replacement stock.`
            : ""
        }
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={() => {
          if (selected)
            setRows((current) =>
              current.map((item) =>
                item.id === selected.id
                  ? { ...item, status: "Approved" }
                  : item,
              ),
            );
          setSelected(null);
          toast.success("Exchange approved in mock mode");
        }}
      />
    </div>
  );
}

function Refunds() {
  const [selected, setSelected] = React.useState<
    (typeof adminRefunds)[number] | null
  >(null);
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Refunds"
        description="Review refund history and approvals. No external payment or refund is executed in this mock workspace."
      />
      <Card>
        <CardHeader>
          <CardTitle>Refund history</CardTitle>
          <CardDescription>
            Every action requires explicit confirmation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminRefunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell>
                    <p className="font-medium">{refund.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {refund.date}
                    </p>
                  </TableCell>
                  <TableCell>
                    {refund.order} · {refund.customer}
                  </TableCell>
                  <TableCell>
                    <Money value={refund.amount} />
                  </TableCell>
                  <TableCell>{refund.method}</TableCell>
                  <TableCell>
                    <Status value={refund.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={refund.status !== "Pending review"}
                      onClick={() => setSelected(refund)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <ConfirmDialog
        title="Approve refund?"
        description={
          selected
            ? `Approve a mock refund of ৳${selected.amount.toLocaleString("en-BD")} for ${selected.order}? No payment provider will be contacted.`
            : ""
        }
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onConfirm={() => {
          setSelected(null);
          toast.info("Refund marked approved in mock mode; no money moved.");
        }}
      />
    </div>
  );
}

function Payments() {
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Payments"
        description="Audit payment states separately from order and delivery operations."
      />
      <Card>
        <CardHeader>
          <CardTitle>Payment ledger</CardTitle>
          <CardDescription>
            Read-only mock records. No payment is simulated as successful.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.id}
                    <p className="text-xs text-muted-foreground">
                      {payment.created}
                    </p>
                  </TableCell>
                  <TableCell>{payment.order}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>
                    <Money value={payment.amount} />
                  </TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Status value={payment.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Shipping() {
  const [charge, setCharge] = React.useState("80");
  return (
    <div className="flex flex-col gap-8">
      <Heading
        title="Shipping"
        description="Configure delivery charges and inspect courier references without booking shipments."
        action={
          <Button
            variant="outline"
            onClick={() =>
              toast.info(
                "Courier booking is intentionally disabled in mock mode.",
              )
            }
          >
            Book courier
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Delivery configuration</CardTitle>
            <CardDescription>
              These values are local mock settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="delivery-charge">
                  Default delivery charge (BDT)
                </FieldLabel>
                <Input
                  id="delivery-charge"
                  type="number"
                  value={charge}
                  onChange={(e) => setCharge(e.target.value)}
                />
              </Field>
              <Button
                onClick={() =>
                  toast.success(
                    `Delivery charge set to ৳${charge} in mock mode`,
                  )
                }
              >
                Save configuration
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courier tracking</CardTitle>
            <CardDescription>
              Tracking references and delivery statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Courier</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Charge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminShipments.map((shipment) => (
                  <TableRow key={shipment.order}>
                    <TableCell>
                      {shipment.order}
                      <p className="text-xs text-muted-foreground">
                        {shipment.customer}
                      </p>
                    </TableCell>
                    <TableCell>{shipment.courier}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {shipment.tracking}
                    </TableCell>
                    <TableCell>
                      <Status value={shipment.status} />
                    </TableCell>
                    <TableCell>
                      <Money value={shipment.charge} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConfirmDialog({
  title,
  description,
  open,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
