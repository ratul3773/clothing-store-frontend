import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field as ShadcnField, FieldLabel } from "@/components/ui/field";
import { addresses, customer, orders } from "@/lib/data/account";
import { formatBDT } from "@/lib/format/currency";
import { useState } from "react";

export function Overview() {
  return (
    <>
      <h2
        id="account-section-title"
        className="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-primary"
      >
        Welcome back, {customer.name.split(" ")[0]}.
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={String(orders.length)} />
        <Stat label="Saved pieces" value="0" />
        <Stat label="Member since" value="2025" />
      </div>
      <div className="mt-10 border-t border-border pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-primary">
              Recent orders
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your latest Neel pieces.
            </p>
          </div>
          <Link
            href="/account?tab=orders"
            className="text-sm font-bold text-foreground underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        <div className="mt-5 grid gap-3">
          {orders.slice(0, 2).map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
}

export function Orders() {
  return (
    <>
      <p className="mt-2 text-sm text-muted-foreground">
        Track deliveries, review purchases and request exchanges.
      </p>
      <div className="mt-7 grid gap-3">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}

function OrderRow({ order }: { order: (typeof orders)[number] }) {
  return (
    <article className="border border-border p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-bold text-foreground">{order.id}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {order.date} · {order.lines.length}{" "}
            {order.lines.length === 1 ? "item" : "items"}
          </p>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold capitalize text-foreground">
          {order.status}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          Total{" "}
          <strong className="ml-2 text-foreground">
            {formatBDT(order.total)}
          </strong>
        </p>
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex min-h-9 items-center justify-center rounded-md border border-input bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
        >
          View order
        </Link>
      </div>
    </article>
  );
}

export function Addresses() {
  const [showForm, setShowForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState(addresses);

  function addAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextAddress = {
      id: `address-${savedAddresses.length + 1}`,
      label: String(formData.get("label")),
      name: String(formData.get("name")),
      phone: String(formData.get("phone")),
      division: String(formData.get("division")),
      district: String(formData.get("district")),
      area: String(formData.get("area")),
      line: String(formData.get("line")),
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses((current) => [...current, nextAddress]);
    setShowForm(false);
    event.currentTarget.reset();
  }

  return (
    <>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="account-section-title"
            className="font-display text-3xl font-black tracking-[-0.04em] text-primary"
          >
            Saved addresses.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Save delivery details for a faster checkout.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Cancel" : "Add address"}
        </Button>
      </div>
      {showForm && <AddressForm onSubmit={addAddress} />}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {savedAddresses.map((address) => (
          <article key={address.id} className="border border-border p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">{address.label}</h3>
              {address.isDefault && (
                <span className="text-xs font-bold text-accent-foreground">
                  Default
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {address.name}
              <br />
              {address.line}
              <br />
              {address.area}, {address.district}
              <br />
              {address.phone}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

function AddressForm({
  onSubmit,
}: {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-7 grid gap-4 border border-border bg-surface p-5 sm:grid-cols-2"
    >
      <AccountField
        label="Address label"
        name="label"
        placeholder="Home"
        required
      />
      <AccountField
        label="Full name"
        name="name"
        placeholder="Your name"
        required
      />
      <AccountField
        label="Phone"
        name="phone"
        placeholder="01700000000"
        required
      />
      <AccountField
        label="Division"
        name="division"
        placeholder="Dhaka"
        required
      />
      <AccountField
        label="District"
        name="district"
        placeholder="Dhaka"
        required
      />
      <AccountField label="Area" name="area" placeholder="Gulshan 1" required />
      <ShadcnField className="sm:col-span-2">
        <FieldLabel htmlFor="line">Street address</FieldLabel>
        <Input
          id="line"
          name="line"
          placeholder="House, road, apartment"
          required
        />
      </ShadcnField>
      <div className="sm:col-span-2">
        <Button type="submit">Save address</Button>
      </div>
    </form>
  );
}

function AccountField({
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <ShadcnField>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </ShadcnField>
  );
}

export function SettingsPanel() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  return (
    <>
      <h2
        id="account-section-title"
        className="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-primary"
      >
        Account settings.
      </h2>
      <div className="mt-7 grid max-w-2xl gap-4">
        <section className="border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-foreground">Personal details</p>
              <div className="mt-4 grid gap-2 text-sm">
                <Detail label="Name" value={customer.name} />
                <Detail label="Phone" value={customer.phone} />
                <Detail label="Email" value={customer.email} />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setProfileOpen((current) => !current)}
            >
              {profileOpen ? "Cancel" : "Edit profile"}
            </Button>
          </div>
          {profileOpen && (
            <form
              className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                setProfileSaved(true);
                setProfileOpen(false);
              }}
            >
              <AccountField
                label="Full name"
                name="profile-name"
                placeholder={customer.name}
                required
              />
              <AccountField
                label="Phone"
                name="profile-phone"
                placeholder={customer.phone}
                required
              />
              <div className="sm:col-span-2">
                <Button type="submit">Save profile</Button>
              </div>
            </form>
          )}
          {profileSaved && (
            <p className="mt-4 text-sm text-muted-foreground">
              Profile details saved for this session.
            </p>
          )}
        </section>
        <section className="border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-foreground">Password</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep your account secure with a strong password.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordOpen((current) => !current)}
            >
              {passwordOpen ? "Cancel" : "Change password"}
            </Button>
          </div>
          {passwordOpen && (
            <form
              className="mt-6 grid gap-4 border-t border-border pt-5"
              onSubmit={(event) => event.preventDefault()}
            >
              <AccountField
                label="Current password"
                name="current-password"
                type="password"
                placeholder="Enter current password"
                required
              />
              <AccountField
                label="New password"
                name="new-password"
                type="password"
                placeholder="At least 8 characters"
                required
              />
              <AccountField
                label="Confirm new password"
                name="confirm-password"
                type="password"
                placeholder="Repeat new password"
                required
              />
              <Button type="submit">Update password</Button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

export function EmptySection({
  title,
  description,
  action,
  href,
}: {
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <>
      <h2
        id="account-section-title"
        className="mt-3 font-display text-3xl font-black tracking-[-0.04em] text-primary"
      >
        {title}.
      </h2>
      <div className="mt-8 border border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">{description}</p>
        <Link
          href={href}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-transform hover:scale-[1.01]"
        >
          {action}
        </Link>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border p-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-black text-primary">
        {value}
      </p>
    </div>
  );
}