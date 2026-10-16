"use client";
import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  MoreHorizontal,
  Plus,
  Save,
  Settings2,
  Star,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  analytics,
  banners,
  bundles,
  cmsPages,
  coupons,
  looks,
  notifications,
  promotions,
  reviews,
  storeSettings,
  type CMSRecord,
} from "@/lib/admin-storefront-data";
import { cn } from "@/lib/utils";
import { AdminPasswordSettings } from "@/components/admin/admin-auth";

type Mode =
  | "storefront"
  | "homepage"
  | "banners"
  | "pages"
  | "coupons"
  | "promotions"
  | "bundles"
  | "looks"
  | "reviews"
  | "analytics"
  | "notifications"
  | "settings";
const labels: Record<Mode, string> = {
  storefront: "Storefront CMS",
  homepage: "Homepage builder",
  banners: "Banner management",
  pages: "Static pages & policies",
  coupons: "Coupons",
  promotions: "Promotions",
  bundles: "Bundles",
  looks: "Complete the look",
  reviews: "Reviews",
  analytics: "Analytics",
  notifications: "Notifications",
  settings: "Store settings",
};
function Heading({ mode, action }: { mode: Mode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Content & growth
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
          {labels[mode]}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Configure how NEEL looks, sells, and communicates. Changes are staged
          in mock services for later API integration.
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
        value === "Published" || value === "Active" || value === "Approved"
          ? "secondary"
          : value === "Flagged"
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
export function StorefrontPage({ mode }: { mode: Mode }) {
  const common = ["storefront", "homepage", "banners", "pages"].includes(mode);
  if (common) return <ContentManager mode={mode} />;
  if (["coupons", "promotions", "bundles", "looks"].includes(mode))
    return <MarketingManager mode={mode} />;
  if (mode === "reviews") return <Reviews />;
  if (mode === "analytics") return <Analytics />;
  if (mode === "notifications") return <Notifications />;
  return <Settings />;
}
function ContentManager({ mode }: { mode: Mode }) {
  const records = mode === "banners" ? banners : cmsPages;
  const [items, setItems] = React.useState(records);
  const [editing, setEditing] = React.useState<CMSRecord | null>(null);
  const [preview, setPreview] = React.useState<CMSRecord | null>(null);
  const [query, setQuery] = React.useState("");
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );
  const save = () => {
    const item = editing ?? {
      id: `draft-${Date.now()}`,
      title: "Untitled section",
      status: "Draft" as const,
      updated: "Just now",
      owner: "Admin",
    };
    setItems((current) =>
      editing
        ? current.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  title: editing.title || "Untitled section",
                  updated: "Just now",
                }
              : row,
          )
        : [...current, item],
    );
    setEditing(null);
    toast.success("Saved as draft");
  };
  return (
    <div className="flex flex-col gap-8">
      <Heading
        mode={mode}
        action={
          <Button
            onClick={() =>
              setEditing({
                id: "",
                title: "",
                status: "Draft",
                updated: "Just now",
                owner: "Admin",
              })
            }
          >
            <Plus data-icon="inline-start" />
            New {mode === "banners" ? "banner" : "page"}
          </Button>
        }
      />
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>
              {mode === "homepage"
                ? "Homepage sections"
                : mode === "storefront"
                  ? "Storefront content"
                  : mode === "banners"
                    ? "Campaign banners"
                    : "Pages and policies"}
            </CardTitle>
            <CardDescription>
              Draft, preview, reorder, and publish without claiming a live
              deployment.
            </CardDescription>
          </div>
          <Input
            className="sm:max-w-xs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search content"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Status value={item.status} />
                  </TableCell>
                  <TableCell>{item.updated}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Preview ${item.title}`}
                        onClick={() => setPreview(item)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.title}`}
                        onClick={() => setEditing(item)}
                      >
                        <Edit3 />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Publish ${item.title}`}
                        onClick={() => {
                          setItems((current) =>
                            current.map((row) =>
                              row.id === item.id
                                ? {
                                    ...row,
                                    status: "Published",
                                    updated: "Just now",
                                  }
                                : row,
                            ),
                          );
                          toast.success("Publication staged");
                        }}
                      >
                        <Check />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Edit content" : "Create draft"}
            </DialogTitle>
            <DialogDescription>
              Save a draft first. Publishing remains an explicit admin action.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="content-title">Title</FieldLabel>
              <Input
                id="content-title"
                value={editing?.title ?? ""}
                onChange={(e) =>
                  setEditing(
                    (current) =>
                      current && { ...current, title: e.target.value },
                  )
                }
                placeholder="New arrivals"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="content-copy">Content notes</FieldLabel>
              <Textarea
                id="content-copy"
                placeholder="Describe the section, image, or policy copy."
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save}>
              <Save data-icon="inline-start" />
              Save draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => !open && setPreview(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview: {preview?.title}</DialogTitle>
            <DialogDescription>
              This is an isolated preview. No storefront publication has
              occurred.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border bg-muted/30 p-8 text-center">
            <p className="font-serif text-3xl">{preview?.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Preview canvas · desktop layout
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function MarketingManager({ mode }: { mode: Mode }) {
  const data =
    mode === "coupons"
      ? coupons
      : mode === "promotions"
        ? promotions
        : mode === "bundles"
          ? bundles
          : looks;
  return (
    <div className="flex flex-col gap-8">
      <Heading
        mode={mode}
        action={
          <Button onClick={() => toast.success("Draft editor opened")}>
            <Plus data-icon="inline-start" />
            New {mode.slice(0, -1)}
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Live items</CardDescription>
            <CardTitle>
              {
                data.filter(
                  (item) =>
                    item.status === "Active" || item.status === "Published",
                ).length
              }
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Drafts</CardDescription>
            <CardTitle>
              {data.filter((item) => item.status === "Draft").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Mock service</CardDescription>
            <CardTitle className="text-base">Ready for RTK Query</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage {labels[mode].toLowerCase()}</CardTitle>
          <CardDescription>
            Associate products, stage changes, and review publication status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.title ?? item.id}
                  </TableCell>
                  <TableCell>
                    {(item.value ?? item.type ?? item.products)
                      ? `${item.products ?? ""} products`
                      : (item.ends ?? item.dates ?? "—")}
                  </TableCell>
                  <TableCell>
                    <Status value={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.uses !== undefined ? (
                      `${item.uses} uses`
                    ) : item.clicks !== undefined ? (
                      `${item.clicks} clicks`
                    ) : item.price ? (
                      <Money value={item.price} />
                    ) : (
                      (item.dates ?? "—")
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit item"
                      onClick={() => toast.success("Draft editor opened")}
                    >
                      <Edit3 />
                    </Button>
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
function Reviews() {
  const [items, setItems] = React.useState(reviews);
  return (
    <div className="flex flex-col gap-8">
      <Heading mode="reviews" />
      <Card>
        <CardHeader>
          <CardTitle>Moderation queue</CardTitle>
          <CardDescription>
            Review customer feedback before it appears publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{review.customer}</TableCell>
                  <TableCell>{review.product}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Star className="fill-current" />
                      {review.rating}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">
                    {review.text}
                  </TableCell>
                  <TableCell>
                    <Status value={review.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {review.status !== "Published" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setItems((current) =>
                            current.map((item) =>
                              item.id === review.id
                                ? { ...item, status: "Published" }
                                : item,
                            ),
                          );
                          toast.success("Review publication staged");
                        }}
                      >
                        Approve
                      </Button>
                    )}
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
function Analytics() {
  const [range, setRange] = React.useState("30");
  return (
    <div className="flex flex-col gap-8">
      <Heading
        mode="analytics"
        action={
          <Select
            value={range}
            onValueChange={(value) => setRange(value ?? "30")}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        }
      />
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          ["Revenue", <Money value={analytics.revenue} />],
          ["Orders", analytics.orders],
          ["Average order", <Money value={analytics.aov} />],
          ["Conversion", `${analytics.conversion}%`],
        ].map(([label, value]) => (
          <Card key={String(label)}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle>{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>BDT revenue reporting</CardTitle>
          <CardDescription>
            Illustrative mock analytics for the selected {range}-day window.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-end gap-3">
            {analytics.series.map((value, index) => (
              <div
                key={value}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-lg bg-primary/80"
                  style={{ height: `${Math.max(16, value / 800)}%` }}
                  title={`৳${value.toLocaleString("en-BD")}`}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function Notifications() {
  return (
    <div className="flex flex-col gap-8">
      <Heading mode="notifications" />
      <Card>
        <CardHeader>
          <CardTitle>Notification rules</CardTitle>
          <CardDescription>
            Control admin and customer messaging. No messages are sent by this
            mock implementation.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
                <Badge variant="outline" className="mt-2">
                  {item.channel}
                </Badge>
              </div>
              <Checkbox
                defaultChecked={item.enabled}
                aria-label={`Enable ${item.title}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
function Settings() {
  const [settings, setSettings] = React.useState(storeSettings);
  const update = (
    key: keyof typeof settings,
    value: string | number | boolean,
  ) => setSettings((current) => ({ ...current, [key]: value }));
  return (
    <div className="flex flex-col gap-8">
      <Heading
        mode="settings"
        action={
          <Button
            onClick={() => toast.success("Settings saved to mock service")}
          >
            <Save data-icon="inline-start" />
            Save settings
          </Button>
        }
      />
      <div className="grid gap-6">
        <AdminPasswordSettings />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Store configuration</CardTitle>
              <CardDescription>
                Regional settings used across the admin experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="store-name">Store name</FieldLabel>
                  <Input
                    id="store-name"
                    value={settings.storeName}
                    onChange={(e) => update("storeName", e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Currency</FieldLabel>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) =>
                      update("currency", value ?? settings.currency)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT (৳)">BDT (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Input
                    id="timezone"
                    value={settings.timezone}
                    onChange={(e) => update("timezone", e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Delivery & merchandising</CardTitle>
              <CardDescription>
                Configurable values used by checkout and catalog previews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {(
                  [
                    ["deliveryInsideDhaka", "Inside Dhaka delivery"],
                    ["deliveryOutsideDhaka", "Outside Dhaka delivery"],
                    ["freeDeliveryThreshold", "Free delivery threshold"],
                    ["lowStockThreshold", "Low stock threshold"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key}>
                    <FieldLabel htmlFor={key}>{label}</FieldLabel>
                    <Input
                      id={key}
                      type="number"
                      value={settings[key]}
                      onChange={(e) => update(key, Number(e.target.value))}
                    />
                    <FieldDescription>
                      Value is stored in the isolated mock settings service.
                    </FieldDescription>
                  </Field>
                ))}
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Review moderation</p>
                    <p className="text-sm text-muted-foreground">
                      Hold new reviews for approval.
                    </p>
                  </div>
                  <Checkbox
                    checked={settings.reviewModeration}
                    onCheckedChange={(checked) =>
                      update("reviewModeration", Boolean(checked))
                    }
                    aria-label="Enable review moderation"
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
