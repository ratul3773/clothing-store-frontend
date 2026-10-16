"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-4 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck />
          </div>
          <div>
            <CardTitle className="font-serif text-3xl">Admin sign in</CardTitle>
            <CardDescription className="mt-2">
              Access the NEEL commerce operations workspace.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              toast.info(
                "Demo sign-in submitted. Connect your auth service to create an admin session.",
              );
            }}
          >
            <Field>
              <FieldLabel htmlFor="admin-email">Admin email</FieldLabel>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@neel.store"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="pr-11"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </Field>
            {submitted && (
              <FieldDescription role="status">
                This is an isolated admin auth surface; no real session was
                created.
              </FieldDescription>
            )}
            <Button type="submit">Sign in to admin</Button>
            <Link
              href="/"
              className="text-center text-sm text-muted-foreground underline underline-offset-4"
            >
              <ArrowLeft data-icon="inline-start" /> Return to storefront
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export function AdminPasswordSettings() {
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin password</CardTitle>
        <CardDescription>
          Update the password used for the admin account. This demo validates
          the flow without persisting credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-xl gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
            toast.info(
              "Password change staged for the connected auth service.",
            );
          }}
        >
          <Field>
            <FieldLabel htmlFor="current-admin-password">
              Current password
            </FieldLabel>
            <Input id="current-admin-password" type="password" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-admin-password">New password</FieldLabel>
            <div className="relative">
              <Input
                id="new-admin-password"
                type={show ? "text" : "password"}
                minLength={8}
                placeholder="At least 8 characters"
                className="pr-11"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            <FieldDescription>
              Use at least 8 characters with a mix of letters and numbers.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-admin-password">
              Confirm new password
            </FieldLabel>
            <Input
              id="confirm-admin-password"
              type="password"
              minLength={8}
              required
            />
          </Field>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit">
              <LockKeyhole data-icon="inline-start" />
              Update password
            </Button>
            {saved && (
              <p className="text-sm text-muted-foreground" role="status">
                Change staged for auth integration.
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
