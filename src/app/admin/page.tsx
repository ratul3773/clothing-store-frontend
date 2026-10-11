"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  PackageCheck,
  RefreshCw,
  TriangleAlert,
  Truck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
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
  adminKpis,
  lowStockItems,
  operations,
  recentOrders,
  salesData,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const chartConfig = { revenue: { label: "Revenue", color: "var(--primary)" } };

export default function AdminDashboardPage() {
  const [range, setRange] = React.useState("6 months");
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Monday, 24 June 2024
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            Good morning, Ayaan.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Here&apos;s the pulse of NEEL today. Your store is moving with
            intention.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw data-icon="inline-start" />
          Refresh data
        </Button>
      </section>
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Key performance indicators"
      >
        {adminKpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card/80">
            <CardHeader className="pb-2">
              <CardDescription>{kpi.label}</CardDescription>
              <CardAction>
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </CardAction>
              <CardTitle className="font-serif text-3xl font-semibold tracking-tight">
                {kpi.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold",
                  kpi.trend === "up" ? "text-success" : "text-destructive",
                )}
              >
                {kpi.trend === "up" ? (
                  <ArrowUpRight data-icon="inline-start" />
                ) : (
                  <ArrowDownRight data-icon="inline-start" />
                )}
                {kpi.change}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {kpi.note}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-serif text-2xl">
                Sales overview
              </CardTitle>
              <CardDescription>
                Revenue performance across the current season.
              </CardDescription>
            </div>
            <select
              aria-label="Sales date range"
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>6 months</option>
              <option>12 months</option>
              <option>30 days</option>
            </select>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ left: -18, right: 12, top: 12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenue-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.24}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    stroke="var(--border)"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: number) => `৳${Math.round(value / 1000)}k`}
                  />
                  <Tooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="url(#revenue-fill)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>Showing {range.toLowerCase()} of revenue</span>
              <span className="inline-flex items-center gap-1 font-semibold text-success">
                <ArrowUpRight data-icon="inline-start" />
                18.4% growth
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Operations</CardTitle>
            <CardDescription>What needs your attention today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {operations.map((item) => (
              <button
                type="button"
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full",
                    item.tone === "warning" && "bg-warning/15 text-warning",
                    item.tone === "info" && "bg-info/15 text-info",
                    item.tone === "destructive" &&
                      "bg-destructive/15 text-destructive",
                  )}
                >
                  <Clock3 />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.detail}
                  </span>
                </span>
                <span className="font-serif text-2xl font-semibold">
                  {item.value}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-serif text-2xl">
                Recent orders
              </CardTitle>
              <CardDescription>
                Your latest customer activity across channels.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View all <ChevronRight data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="pl-6 font-mono text-xs font-semibold">
                        {order.id}
                        <span className="mt-1 block font-sans font-normal text-muted-foreground">
                          {order.time}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.customer}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.item}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Cancelled"
                              ? "destructive"
                              : order.status === "Delivered"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right font-semibold">
                        {order.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Low stock</CardTitle>
            <CardDescription>
              Restock before your best sellers run out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {lowStockItems
              .filter((item) => !dismissed.includes(item.name))
              .map((item) => (
                <div key={item.name} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-8 place-items-center rounded-full bg-warning/15 text-warning">
                    <TriangleAlert />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.variant} · {item.stock} left
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-warning"
                        style={{
                          width: `${Math.min((item.stock / item.threshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setDismissed((current) => [...current, item.name])
                    }
                    aria-label={`Dismiss ${item.name}`}
                  >
                    <Check data-icon="inline-start" />
                  </Button>
                </div>
              ))}
            {dismissed.length === lowStockItems.length && (
              <p className="py-4 text-sm text-muted-foreground">
                All stock alerts are clear.
              </p>
            )}
            <Separator />
            <Button variant="outline" className="w-full">
              Open inventory <ChevronRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-success/12 text-success">
              <PackageCheck />
            </span>
            <div>
              <p className="text-sm font-semibold">Fulfilment health</p>
              <p className="mt-1 text-2xl font-serif font-semibold">96.8%</p>
              <p className="text-xs text-muted-foreground">
                On-time dispatch rate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-info/12 text-info">
              <Truck />
            </span>
            <div>
              <p className="text-sm font-semibold">Delivery today</p>
              <p className="mt-1 text-2xl font-serif font-semibold">
                42 parcels
              </p>
              <p className="text-xs text-muted-foreground">
                Across Dhaka Metro
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-warning/12 text-warning">
              <RefreshCw />
            </span>
            <div>
              <p className="text-sm font-semibold">Exchange rate</p>
              <p className="mt-1 text-2xl font-serif font-semibold">2.1%</p>
              <p className="text-xs text-muted-foreground">
                Healthy for the category
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
