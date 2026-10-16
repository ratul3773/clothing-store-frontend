"use client";

import Image from "next/image";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  CalendarClock,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Eye,
  MoreHorizontal,
  Package,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  flashSaleCatalog,
  formatBDT,
  getDiscountPercentage,
  getEligibleVariants,
  getFlashSaleProduct,
  getFlashSaleProductStock,
  getFlashSaleSku,
  getFlashSaleStatus,
  getVariantStock,
  initialFlashSales,
  type FlashSaleCampaign,
  type FlashSaleItem,
  type FlashSaleStatus,
  type FlashSaleVariant,
} from "@/lib/admin-flash-sales-data";
import { cn } from "@/lib/utils";

function subscribeToMinuteChanges(callback: () => void) {
  const interval = window.setInterval(callback, 30_000);
  return () => window.clearInterval(interval);
}

function getCurrentMinute() {
  return Math.floor(Date.now() / 60_000);
}

function getServerMinute() {
  return getCurrentMinute();
}

const statuses: Array<FlashSaleStatus | "All"> = [
  "All",
  "Draft",
  "Scheduled",
  "Active",
  "Paused",
  "Expired",
  "Cancelled",
];

type Confirmation =
  | { type: "cancel" | "delete"; campaign: FlashSaleCampaign }
  | null;

const currency = (amount: number) => formatBDT(amount);

function formatDateTime(value: string) {
  if (!value || !Number.isFinite(new Date(value).getTime())) {
    return "Choose a date and time";
  }
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function getLocalDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : undefined;
}

function combineLocalDateTime(date: Date, time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const localDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Number(hours),
    Number(minutes),
  );
  return localDate.toISOString();
}

function DateTimePicker({
  id,
  label,
  value,
  invalid,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = getLocalDate(value);
  const timeValue = selectedDate
    ? `${String(selectedDate.getHours()).padStart(2, "0")}:${String(
        selectedDate.getMinutes(),
      ).padStart(2, "0")}`
    : "";
  const dateLabel = selectedDate
    ? new Intl.DateTimeFormat("en-BD", {
        dateStyle: "medium",
      }).format(selectedDate)
    : "Choose a date";

  return (
    <div className="grid gap-2">
      <Label htmlFor={`${id}-date`}>{label}</Label>
      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                id={`${id}-date`}
                type="button"
                variant="outline"
                aria-invalid={invalid}
                aria-label={`${label}: ${dateLabel}`}
                className="w-full justify-start gap-2 font-normal"
              />
            }
          >
            <CalendarDays aria-hidden="true" />
            <span className="truncate">{dateLabel}</span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                if (!date) return;
                onChange(
                  combineLocalDateTime(date, timeValue || "00:00"),
                );
                setOpen(false);
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          id={`${id}-time`}
          type="time"
          value={timeValue}
          aria-label={`${label} time`}
          aria-invalid={invalid}
          onChange={(event) => {
            if (!selectedDate || !event.target.value) return;
            onChange(combineLocalDateTime(selectedDate, event.target.value));
          }}
        />
      </div>
    </div>
  );
}

function makeNewCampaign(): FlashSaleCampaign {
  const start = new Date(Date.now() + 60 * 60 * 1000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return {
    id: "",
    name: "",
    description: "",
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    status: "Draft",
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function newItem(productId: string): FlashSaleItem {
  const product = getFlashSaleProduct(productId);
  return {
    productId,
    pricingMode: "product",
    salePrice: product ? Math.max(1, Math.round(product.price * 0.8)) : 1,
    variants: [],
  };
}

function getCampaignValidationErrors(
  campaign: FlashSaleCampaign,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!campaign.name.trim()) errors.name = "Enter a campaign name.";
  const start = new Date(campaign.startAt).getTime();
  const end = new Date(campaign.endAt).getTime();
  if (!Number.isFinite(start)) errors.startAt = "Choose a start time.";
  if (!Number.isFinite(end)) errors.endAt = "Choose an end time.";
  if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
    errors.endAt = "End time must be later than the start time.";
  }
  if (campaign.items.length === 0) {
    errors.items = "Select at least one product for this campaign.";
  }
  campaign.items.forEach((item) => {
    const product = getFlashSaleProduct(item.productId);
    if (!product) return;
    const prices =
      item.pricingMode === "product"
        ? [item.salePrice]
        : item.variants.map((variant) => variant.salePrice);
    if (prices.length === 0) {
      errors[`variants-${item.productId}`] =
        "Choose at least one eligible variant.";
    } else if (
      prices.some(
        (price) =>
          !Number.isInteger(price) ||
          price <= 0 ||
          price >= product.price,
      )
    ) {
      errors[`price-${item.productId}`] =
        `Enter a whole-BDT sale price above ৳0 and below ${currency(product.price)}.`;
    }
    if (
      item.quantityLimit !== undefined &&
      (!Number.isInteger(item.quantityLimit) || item.quantityLimit <= 0)
    ) {
      errors[`quantity-${item.productId}`] =
        "Enter a quantity limit greater than zero, or leave it empty.";
    }
  });
  return errors;
}

function CampaignStatusBadge({ status }: { status: FlashSaleStatus }) {
  const variant =
    status === "Active"
      ? "secondary"
      : status === "Cancelled"
        ? "destructive"
        : status === "Draft" || status === "Paused"
          ? "outline"
          : "default";

  return <Badge variant={variant}>{status}</Badge>;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Zap;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-4 pt-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

function getCampaignItemsLabel(campaign: FlashSaleCampaign) {
  const count = campaign.items.reduce(
    (total, item) =>
      total +
      (item.pricingMode === "product"
        ? 1
        : item.variants.length),
    0,
  );

  return `${campaign.items.length} ${campaign.items.length === 1 ? "product" : "products"}${
    count > campaign.items.length
      ? ` · ${count} sale ${count === 1 ? "item" : "items"}`
      : ""
  }`;
}

export function FlashSalesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addProductId = searchParams.get("addProduct");
  const addProduct = addProductId
    ? getFlashSaleProduct(addProductId)
    : undefined;
  const [campaigns, setCampaigns] =
    React.useState<FlashSaleCampaign[]>(initialFlashSales);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] =
    React.useState<FlashSaleStatus | "All">("All");
  const [editor, setEditor] = React.useState<FlashSaleCampaign | null>(() =>
    addProduct
      ? { ...makeNewCampaign(), items: [newItem(addProduct.id)] }
      : null,
  );
  const [editorOpen, setEditorOpen] = React.useState(Boolean(addProduct));
  const [viewing, setViewing] = React.useState<FlashSaleCampaign | null>(null);
  const [confirmation, setConfirmation] = React.useState<Confirmation>(null);
  const invalidProductToastShown = React.useRef(false);
  const now = React.useSyncExternalStore(
    subscribeToMinuteChanges,
    getCurrentMinute,
    getServerMinute,
  ) * 60_000;

  React.useEffect(() => {
    if (!addProductId) return;

    if (!addProduct && !invalidProductToastShown.current) {
      invalidProductToastShown.current = true;
      toast.error("This product is no longer available in the catalog.");
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("addProduct");
    const query = nextSearchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [addProduct, addProductId, pathname, router, searchParams]);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const status = getFlashSaleStatus(campaign, now);
    const matchesStatus = statusFilter === "All" || status === statusFilter;
    const matchesQuery = campaign.name
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const counts = campaigns.reduce(
    (summary, campaign) => {
      const status = getFlashSaleStatus(campaign, now);
      summary.total += 1;
      if (status === "Active") summary.active += 1;
      if (status === "Scheduled") summary.scheduled += 1;
      if (status === "Expired") summary.expired += 1;
      return summary;
    },
    { total: 0, active: 0, scheduled: 0, expired: 0 },
  );

  function openCreate() {
    setEditor(makeNewCampaign());
    setEditorOpen(true);
  }

  function openEdit(campaign: FlashSaleCampaign) {
    setEditor({
      ...campaign,
      items: campaign.items.map((item) => ({
        ...item,
        variants: item.variants.map((variant) => ({ ...variant })),
      })),
    });
    setEditorOpen(true);
  }

  function saveCampaign(
    draft: FlashSaleCampaign,
    saveAsDraft: boolean,
  ) {
    const saved: FlashSaleCampaign = {
      ...draft,
      id: draft.id || `fs-${Date.now()}`,
      status: saveAsDraft ? "Draft" : draft.status,
      createdAt: draft.id ? draft.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCampaigns((current) =>
      draft.id
        ? current.map((campaign) =>
            campaign.id === draft.id ? saved : campaign,
          )
        : [saved, ...current],
    );
    setEditorOpen(false);
    setEditor(null);
    toast.success(saveAsDraft ? "Flash sale saved as draft" : "Flash sale saved");
  }

  function updateStatus(campaign: FlashSaleCampaign, status: FlashSaleStatus) {
    setCampaigns((current) =>
      current.map((item) =>
        item.id === campaign.id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
    toast.success(status === "Paused" ? "Campaign paused" : "Campaign resumed");
  }

  function confirmCampaignAction() {
    if (!confirmation) return;
    const { type, campaign } = confirmation;
    setCampaigns((current) =>
      type === "delete"
        ? current.filter((item) => item.id !== campaign.id)
        : current.map((item) =>
            item.id === campaign.id
              ? {
                  ...item,
                  status: "Cancelled",
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
    );
    toast.success(type === "delete" ? "Draft deleted" : "Campaign cancelled");
    setConfirmation(null);
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Flash Sales
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage time-limited promotions for products and variants.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus data-icon="inline-start" />
          Create Flash Sale
        </Button>
      </div>

      <section
        aria-label="Campaign summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard label="Total Campaigns" value={counts.total} icon={Zap} />
        <SummaryCard
          label="Active Campaigns"
          value={counts.active}
          icon={Play}
        />
        <SummaryCard
          label="Scheduled Campaigns"
          value={counts.scheduled}
          icon={CalendarClock}
        />
        <SummaryCard
          label="Expired Campaigns"
          value={counts.expired}
          icon={Archive}
        />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>
              Schedule product and variant pricing for a defined time window.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search campaigns"
                aria-label="Search campaigns by name"
                className="pl-9 sm:w-56"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter((value as FlashSaleStatus | "All") ?? "All")
              }
            >
              <SelectTrigger aria-label="Filter by status" className="sm:w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(query || statusFilter !== "All") && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("All");
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-muted">
                <CalendarDays className="size-5 text-muted-foreground" />
              </span>
              <div>
                <p className="font-medium">No flash sales yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a campaign to schedule a time-limited offer.
                </p>
              </div>
              <Button variant="outline" onClick={openCreate}>
                <Plus data-icon="inline-start" />
                Create Flash Sale
              </Button>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-14 text-center">
              <Search className="size-5 text-muted-foreground" />
              <p className="font-medium">No campaigns match these filters</p>
              <p className="text-sm text-muted-foreground">
                Try another search or reset the filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("All");
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Selected products</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Ends</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const status = getFlashSaleStatus(campaign, now);

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="min-w-48">
                        <p className="font-medium">{campaign.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Updated {formatDateTime(campaign.updatedAt)}
                        </p>
                      </TableCell>
                      <TableCell>{getCampaignItemsLabel(campaign)}</TableCell>
                      <TableCell className="min-w-40">
                        {formatDateTime(campaign.startAt)}
                      </TableCell>
                      <TableCell className="min-w-40">
                        {formatDateTime(campaign.endAt)}
                      </TableCell>
                      <TableCell>
                        <CampaignStatusBadge status={status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Actions for ${campaign.name}`}
                              />
                            }
                          >
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setViewing(campaign)}
                            >
                              <Eye />
                              View details
                            </DropdownMenuItem>
                            {(status === "Draft" ||
                              status === "Scheduled" ||
                              status === "Active" ||
                              status === "Paused") && (
                              <DropdownMenuItem
                                onClick={() => openEdit(campaign)}
                              >
                                <CalendarClock />
                                Edit campaign
                              </DropdownMenuItem>
                            )}
                            {status === "Active" && (
                              <DropdownMenuItem
                                onClick={() => updateStatus(campaign, "Paused")}
                              >
                                <Pause />
                                Pause campaign
                              </DropdownMenuItem>
                            )}
                            {status === "Paused" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus(
                                    campaign,
                                    new Date(campaign.startAt).getTime() > now
                                      ? "Scheduled"
                                      : "Active",
                                  )
                                }
                              >
                                <Play />
                                Resume campaign
                              </DropdownMenuItem>
                            )}
                            {(status === "Scheduled" ||
                              status === "Active" ||
                              status === "Paused") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() =>
                                    setConfirmation({ type: "cancel", campaign })
                                  }
                                >
                                  <X />
                                  Cancel campaign
                                </DropdownMenuItem>
                              </>
                            )}
                            {status === "Draft" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() =>
                                    setConfirmation({ type: "delete", campaign })
                                  }
                                >
                                  <Trash2 />
                                  Delete draft
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {editorOpen && editor && (
        <CampaignEditor
          key={editor.id || "new"}
          campaign={editor}
          onOpenChange={(open) => {
            setEditorOpen(open);
            if (!open) setEditor(null);
          }}
          onSave={saveCampaign}
        />
      )}
      <CampaignDetails
        campaign={viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />
      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => !open && setConfirmation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation?.type === "delete"
                ? "Delete this draft?"
                : "Cancel this campaign?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation?.type === "delete"
                ? "This draft will be removed from the campaign list."
                : "This campaign will be marked as cancelled and will no longer be active."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep campaign</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmCampaignAction}
            >
              {confirmation?.type === "delete" ? "Delete draft" : "Cancel campaign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CampaignEditor({
  campaign,
  onOpenChange,
  onSave,
}: {
  campaign: FlashSaleCampaign;
  onOpenChange: (open: boolean) => void;
  onSave: (campaign: FlashSaleCampaign, saveAsDraft: boolean) => void;
}) {
  const [draft, setDraft] = React.useState<FlashSaleCampaign>(campaign);
  const [productQuery, setProductQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [variantProduct, setVariantProduct] = React.useState<string | null>(
    null,
  );

  const errors = getCampaignValidationErrors(draft);

  const filteredProducts = flashSaleCatalog.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(productQuery.trim().toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  function updateDraft(updates: Partial<FlashSaleCampaign>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function updateItem(productId: string, updates: Partial<FlashSaleItem>) {
    setDraft((current) =>
      ({
        ...current,
        items: current.items.map((item) =>
          item.productId === productId ? { ...item, ...updates } : item,
        ),
      }),
    );
  }

  function toggleProduct(productId: string) {
    const exists = draft.items.some((item) => item.productId === productId);
    updateDraft({
      items: exists
        ? draft.items.filter((item) => item.productId !== productId)
        : [...draft.items, newItem(productId)],
    });
  }

  function toggleVariant(
    item: FlashSaleItem,
    color: string,
    size: string,
    checked: boolean,
  ) {
    const product = getFlashSaleProduct(item.productId);
    if (!product) return;
    const existing = item.variants.find(
      (variant) => variant.color === color && variant.size === size,
    );
    const variants = checked
      ? existing
        ? item.variants
        : [
            ...item.variants,
            {
              color,
              size,
              salePrice: item.salePrice || Math.round(product.price * 0.8),
            },
          ]
      : item.variants.filter(
          (variant) => variant.color !== color || variant.size !== size,
        );
    updateItem(item.productId, { variants });
  }

  function updateVariant(
    item: FlashSaleItem,
    variantIndex: number,
    salePrice: number,
  ) {
    updateItem(item.productId, {
      variants: item.variants.map((variant, index) =>
        index === variantIndex ? { ...variant, salePrice } : variant,
      ),
    });
  }

  function submit(saveAsDraft: boolean) {
    if (Object.keys(errors).length > 0) return;
    onSave(draft, saveAsDraft);
  }

  const itemCount = draft.items.reduce(
    (count, item) =>
      count + (item.pricingMode === "product" ? 1 : item.variants.length),
    0,
  );
  const discounts = draft.items.flatMap((item) => {
    const product = getFlashSaleProduct(item.productId);
    if (!product) return [];
    const prices =
      item.pricingMode === "product"
        ? [item.salePrice]
        : item.variants.map((variant) => variant.salePrice);
    return prices.map((price) =>
      getDiscountPercentage(product.price, price),
    );
  });
  const discountRange =
    discounts.length > 0
      ? `${Math.min(...discounts)}%–${Math.max(...discounts)}%`
      : "—";

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        size="wide"
        className=" flex h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[1200px] flex-col gap-0 overflow-hidden p-0 sm:h-[min(90dvh,900px)] sm:w-[min(96vw,1200px)]"
      >
        <DialogHeader className="shrink-0 border-b border-border bg-background p-0">
          <div className="mx-auto w-full max-w-[88rem] pl-4 pr-12 py-4 sm:pl-6 sm:pr-14 sm:py-5 lg:pl-8 lg:pr-14">
            <DialogTitle className="text-xl sm:text-2xl">
              {draft.id ? "Edit flash sale" : "Create flash sale"}
            </DialogTitle>
            <DialogDescription className="mt-1 max-w-3xl text-sm leading-relaxed">
              Set the campaign schedule, choose products, and configure sale
              pricing. Scheduled campaigns become active during the selected
              window.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto grid w-full max-w-[88rem] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-6 lg:px-8 lg:py-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign information</CardTitle>
                <CardDescription>
                  Choose a name and when the offer should run.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="flash-sale-name">Campaign name</Label>
                  <Input
                    id="flash-sale-name"
                    value={draft.name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(event) =>
                      updateDraft({ name: event.target.value })
                    }
                    placeholder="e.g. Friday Shirt Edit"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="flash-sale-description">
                    Description <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="flash-sale-description"
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft({ description: event.target.value })
                    }
                    rows={2}
                    placeholder="Add an internal note about this campaign"
                  />
                </div>
                <div>
                  <DateTimePicker
                    id="flash-sale-start"
                    label="Starts"
                    value={draft.startAt}
                    invalid={Boolean(errors.startAt)}
                    onChange={(startAt) => updateDraft({ startAt })}
                  />
                  {errors.startAt && (
                    <p className="text-sm text-destructive">{errors.startAt}</p>
                  )}
                </div>
                <div>
                  <DateTimePicker
                    id="flash-sale-end"
                    label="Ends"
                    value={draft.endAt}
                    invalid={Boolean(errors.endAt)}
                    onChange={(endAt) => updateDraft({ endAt })}
                  />
                  {errors.endAt && (
                    <p className="text-sm text-destructive">{errors.endAt}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="flash-sale-status">Campaign status</Label>
                  <Select
                    value={draft.status}
                    onValueChange={(value) =>
                      value &&
                      updateDraft({ status: value as FlashSaleStatus })
                    }
                  >
                    <SelectTrigger id="flash-sale-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["Draft", "Scheduled", "Active", "Paused"] as const).map(
                        (status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Alert>
                <CalendarClock />
                <AlertDescription>
                  Campaign dates use your local time. A scheduled sale is
                  considered active only inside its start and end times.
                </AlertDescription>
              </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <CardTitle>Choose products</CardTitle>
                  <CardDescription className="mt-1">
                    Select a product, then set one price or choose specific
                    size and colour variants.
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {draft.items.length} selected
                </Badge>
              </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2 sm:grid-cols-[1fr_10rem]">
                <div className="relative">
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={productQuery}
                    onChange={(event) => setProductQuery(event.target.value)}
                    placeholder="Search all products"
                    aria-label="Search catalog products"
                    className="pl-9"
                  />
                </div>
                <Select value={category} onValueChange={(value) => value && setCategory(value)}>
                  <SelectTrigger aria-label="Filter products by category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="shirts">Shirts</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const selected = draft.items.some(
                      (item) => item.productId === product.id,
                    );
                    const image = product.images[0] ?? "/images/p-oxford-white.png";

                    return (
                      <button
                        key={product.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleProduct(product.id)}
                        className={cn(
                          "flex w-full items-center gap-3 border-b border-border p-3 text-left last:border-b-0 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selected && "bg-muted/40",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-4 shrink-0 place-items-center rounded-[4px] border border-input text-primary-foreground",
                            selected && "border-primary bg-primary",
                          )}
                        >
                          {selected && <Check className="size-3" />}
                        </span>
                        <Image
                          src={image}
                          alt=""
                          width={48}
                          height={56}
                          className="size-12 rounded-md bg-muted object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {product.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {getFlashSaleSku(product.id) ?? "SKU unavailable"}{" "}
                            · {product.category === "shirts" ? "Shirts" : "Pants"}{" "}
                            · {product.sizes.length} sizes · {product.colors.length} colours
                          </span>
                        </span>
                        <span className="text-right text-sm font-medium">
                          {product.offerPrice ? (
                            <>
                              <span className="block">
                                {currency(product.offerPrice)}{" "}
                                <span className="text-xs text-muted-foreground">
                                  offer
                                </span>
                              </span>
                              <span className="block text-xs font-normal text-muted-foreground line-through">
                                {currency(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="block">
                              {currency(product.price)}
                            </span>
                          )}
                          <span className="block text-xs font-normal text-muted-foreground">
                            Stock {getFlashSaleProductStock(product.id)}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="p-5 text-center text-sm text-muted-foreground">
                    No products match your search.
                  </p>
                )}
              </div>
              {errors.items && (
                <p className="text-sm text-destructive">{errors.items}</p>
              )}

              {draft.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <Package className="mx-auto size-5 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">No products selected</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Choose one or more catalog products above.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {draft.items.map((item) => (
                    <SelectedProduct
                      key={item.productId}
                      item={item}
                      expanded={variantProduct === item.productId}
                      errors={errors}
                      onRemove={() => toggleProduct(item.productId)}
                      onToggleVariants={() =>
                        setVariantProduct((current) =>
                          current === item.productId ? null : item.productId,
                        )
                      }
                      onUpdate={(updates) => updateItem(item.productId, updates)}
                      onToggleVariant={(color, size, checked) =>
                        toggleVariant(item, color, size, checked)
                      }
                      onUpdateVariant={(index, price) =>
                        updateVariant(item, index, price)
                      }
                    />
                  ))}
                </div>
              )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit lg:sticky lg:top-4" size="sm">
            <CardHeader>
              <CardTitle>Campaign summary</CardTitle>
            </CardHeader>
            <CardContent>
            <dl className="flex flex-col gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Campaign</dt>
                <dd className="mt-1 font-medium">
                  {draft.name.trim() || "Untitled campaign"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Schedule</dt>
                <dd className="mt-1 leading-relaxed">
                  {formatDateTime(draft.startAt)}
                  <span className="mx-1 text-muted-foreground">to</span>
                  {formatDateTime(draft.endAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Products selected</dt>
                <dd className="font-medium tabular-nums">{draft.items.length}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Configured sale items</dt>
                <dd className="font-medium tabular-nums">{itemCount}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Discount range</dt>
                <dd className="font-medium tabular-nums">{discountRange}</dd>
              </div>
            </dl>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Item validation
              </p>
              {errors.items ||
              Object.keys(errors).some(
                (key) =>
                  key.startsWith("price-") || key.startsWith("variants-"),
              ) ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-destructive">
                  <CircleAlert className="size-4 shrink-0" />
                  Review selected items
                </p>
              ) : draft.items.length > 0 ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-success">
                  <Check className="size-4 shrink-0" />
                  {itemCount} sale {itemCount === 1 ? "item is" : "items are"} configured
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Select products to configure prices.
                </p>
              )}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Quantity limits are campaign-specific display settings only.
              They do not reserve inventory or enforce stock limits.
            </p>
            </CardContent>
          </Card>
        </div>
        </div>

        <div className="shrink-0 border-t border-border bg-background">
          <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={Object.keys(errors).length > 0}
                onClick={() => submit(true)}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={Object.keys(errors).length > 0}
                onClick={() => submit(false)}
              >
                {draft.status === "Scheduled" ? "Schedule Campaign" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SelectedProduct({
  item,
  expanded,
  errors,
  onRemove,
  onToggleVariants,
  onUpdate,
  onToggleVariant,
  onUpdateVariant,
}: {
  item: FlashSaleItem;
  expanded: boolean;
  errors: Record<string, string>;
  onRemove: () => void;
  onToggleVariants: () => void;
  onUpdate: (updates: Partial<FlashSaleItem>) => void;
  onToggleVariant: (color: string, size: string, checked: boolean) => void;
  onUpdateVariant: (index: number, salePrice: number) => void;
}) {
  const product = getFlashSaleProduct(item.productId);
  if (!product) return null;
  const regularPrice = product.price;
  const salePriceValid =
    item.salePrice > 0 && item.salePrice < regularPrice;

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-4 pt-3">
        <div className="flex items-start gap-3">
          <Image
            src={product.images[0] ?? "/images/p-oxford-white.png"}
            alt=""
            width={52}
            height={60}
            className="size-13 rounded-md bg-muted object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{product.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {getFlashSaleSku(product.id) ?? "SKU unavailable"} ·{" "}
              {product.category === "shirts" ? "Shirt" : "Pants"} · Regular{" "}
              {currency(regularPrice)} · Stock{" "}
              {getFlashSaleProductStock(product.id)}
              {product.offerPrice && (
                <> · Current offer {currency(product.offerPrice)}</>
              )}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${product.name} from campaign`}
            onClick={onRemove}
          >
            <X />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(10rem,1fr)_minmax(10rem,1fr)]">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`pricing-${product.id}`}>Pricing applies to</Label>
            <Select
              value={item.pricingMode}
              onValueChange={(value) => {
                if (value === "product" || value === "variant") {
                  onUpdate({
                    pricingMode: value,
                    variants: value === "product" ? [] : item.variants,
                  });
                }
              }}
            >
              <SelectTrigger id={`pricing-${product.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Entire product</SelectItem>
                <SelectItem value="variant">Selected variants</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {item.pricingMode === "product" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor={`price-${product.id}`}>Flash sale price</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`price-${product.id}`}
                  type="number"
                  min="1"
                  max={regularPrice - 1}
                  step="1"
                  inputMode="numeric"
                  value={item.salePrice}
                  aria-invalid={
                    Boolean(errors[`price-${product.id}`]) || !salePriceValid
                  }
                  onChange={(event) =>
                    onUpdate({ salePrice: Number(event.target.value) })
                  }
                />
                <Badge variant={salePriceValid ? "secondary" : "destructive"}>
                  {getDiscountPercentage(regularPrice, item.salePrice)}% off
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Available stock: {getFlashSaleProductStock(product.id)} · Sale price must be
                below {currency(regularPrice)}.
              </p>
            </div>
          )}
        </div>

        {item.pricingMode === "product" && errors[`price-${product.id}`] && (
          <p className="text-sm text-destructive">
            {errors[`price-${product.id}`]}
          </p>
        )}

        {item.pricingMode === "variant" && (
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between sm:w-fit"
              onClick={onToggleVariants}
              aria-expanded={expanded}
            >
              Choose size and colour variants
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </Button>
            {expanded && (
              <div className="max-h-52 overflow-y-auto rounded-lg border border-border">
                {getEligibleVariants(product).map(({ color, size }) => {
                  const selectedIndex = item.variants.findIndex(
                    (variant) =>
                      variant.color === color && variant.size === size,
                  );
                  const selected = selectedIndex >= 0;
                  const stock = getVariantStock(product, color, size);
                  return (
                    <div
                      key={`${color}-${size}`}
                      className="flex min-h-11 flex-wrap items-center gap-3 border-b border-border px-3 py-2 last:border-0 sm:flex-nowrap"
                    >
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) =>
                          onToggleVariant(color, size, checked === true)
                        }
                        aria-label={`${color}, size ${size}, ${stock} available`}
                      />
                      <span className="min-w-0 flex-1 text-sm">
                        {color} / {size}
                        <span className="ml-2 text-xs text-muted-foreground">
                          Stock {stock}
                        </span>
                      </span>
                      {selected && (
                        <div className="ml-7 flex items-center gap-2 sm:ml-0">
                          <Label
                            className="sr-only"
                            htmlFor={`variant-price-${product.id}-${selectedIndex}`}
                          >
                            Flash sale price for {color} size {size}
                          </Label>
                          <Input
                            id={`variant-price-${product.id}-${selectedIndex}`}
                            type="number"
                            min="1"
                            max={regularPrice - 1}
                            step="1"
                            inputMode="numeric"
                            value={item.variants[selectedIndex]?.salePrice ?? ""}
                            onChange={(event) =>
                              onUpdateVariant(
                                selectedIndex,
                                Number(event.target.value),
                              )
                            }
                            className="h-9 w-24 shrink-0 sm:w-28"
                            aria-invalid={
                              (item.variants[selectedIndex]?.salePrice ?? 0) <=
                                0 ||
                              (item.variants[selectedIndex]?.salePrice ?? 0) >=
                                regularPrice
                            }
                          />
                          <span className="whitespace-nowrap text-xs text-muted-foreground">
                            {getDiscountPercentage(
                              regularPrice,
                              item.variants[selectedIndex]?.salePrice ?? 0,
                            )}
                            % off
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {item.variants.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {item.variants.length} variants selected · Regular{" "}
                {currency(regularPrice)}
                {product.offerPrice
                  ? ` · Current offer ${currency(product.offerPrice)}`
                  : ""}
              </p>
            )}
            {errors[`variants-${product.id}`] && (
              <p className="text-sm text-destructive">
                {errors[`variants-${product.id}`]}
              </p>
            )}
            {errors[`price-${product.id}`] && (
              <p className="text-sm text-destructive">
                {errors[`price-${product.id}`]}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-2 sm:max-w-sm">
          <Label htmlFor={`limit-${product.id}`}>
            Campaign-specific sale quantity limit
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </Label>
          <Input
            id={`limit-${product.id}`}
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="No additional limit"
            value={item.quantityLimit ?? ""}
            aria-invalid={Boolean(errors[`quantity-${product.id}`])}
            onChange={(event) =>
              onUpdate({
                quantityLimit: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
          />
          {errors[`quantity-${product.id}`] ? (
            <p className="text-sm text-destructive">
              {errors[`quantity-${product.id}`]}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {item.quantityLimit
                ? `Campaign limit: ${item.quantityLimit} units. This does not reserve inventory.`
                : "No additional campaign-specific quantity limit."}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


function CampaignDetails({
  campaign,
  onOpenChange,
}: {
  campaign: FlashSaleCampaign | null;
  onOpenChange: (open: boolean) => void;
}) {
  const status = campaign ? getFlashSaleStatus(campaign) : null;

  return (
    <Dialog
      open={campaign !== null}
      onOpenChange={(open) => onOpenChange(open)}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(90dvh,850px)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0"
      >
        {campaign && status && (
          <>
            {/* Fixed header */}
            <DialogHeader className="shrink-0 border-b px-5 py-5 pr-14 sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-semibold">
                  {campaign.name}
                </DialogTitle>
                <CampaignStatusBadge status={status} />
              </div>

              <DialogDescription className="leading-relaxed">
                {campaign.description ||
                  "No campaign description provided."}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="flex flex-col gap-6 p-5 sm:p-6">
                <section className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Starts</p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(campaign.startAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Ends</p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(campaign.endAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(campaign.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Last updated
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(campaign.updatedAt)}
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="font-semibold">
                    Products and sale pricing
                  </h2>

                  <div className="mt-3 flex flex-col gap-3">
                    {campaign.items.map((item) => {
                      const product = getFlashSaleProduct(item.productId);

                      if (!product) return null;

                      const rows: FlashSaleVariant[] =
                        item.pricingMode === "product"
                          ? [
                              {
                                color: "All colours",
                                size: "All sizes",
                                salePrice: item.salePrice,
                              },
                            ]
                          : item.variants;

                      return (
                        <Card key={item.productId} size="sm">
                          <CardContent className="pt-3">
                            <div className="flex items-center gap-3">
                              <Image
                                src={
                                  product.images[0] ??
                                  "/images/p-oxford-white.png"
                                }
                                alt={product.name}
                                width={44}
                                height={52}
                                className="size-11 shrink-0 rounded-md bg-muted object-cover"
                              />

                              <div className="min-w-0">
                                <p className="font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Regular {currency(product.price)}
                                  {product.offerPrice
                                    ? ` · Existing offer ${currency(
                                        product.offerPrice,
                                      )}`
                                    : ""}
                                </p>
                              </div>
                            </div>

                            {rows.length > 0 ? (
                              <div className="mt-3 divide-y divide-border">
                                {rows.map((variant, index) => (
                                  <div
                                    key={`${variant.color}-${variant.size}-${index}`}
                                    className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
                                  >
                                    <span className="text-muted-foreground">
                                      {variant.color} / {variant.size}
                                    </span>

                                    <span className="text-right">
                                      <span className="font-medium">
                                        {currency(variant.salePrice)}
                                      </span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        {getDiscountPercentage(
                                          product.price,
                                          variant.salePrice,
                                        )}
                                        % off
                                      </span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-3 text-sm text-muted-foreground">
                                No variants configured.
                              </p>
                            )}

                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              Available stock:{" "}
                              {getFlashSaleProductStock(product.id)}
                              {item.quantityLimit
                                ? ` · Campaign-specific limit: ${item.quantityLimit}`
                                : ""}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  Campaign details and catalog values shown here are local UI
                  data. No sale has been published or inventory reserved.
                </p>
              </div>
            </div>

            {/* Fixed footer */}
            <DialogFooter className="shrink-0 border-t px-5 py-3 sm:px-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
