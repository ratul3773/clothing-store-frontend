// components/header/auth-slot.tsx  (server component, no "use client")
import Link from "next/link";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/auth-session";
import { SignOutButton } from "../common/sign-out-button";

export async function AuthSlot() {
  const session = await getServerSession();

  if (!session.isAuthenticated) {
    return (
      <Link href="/login" className="hidden sm:inline-flex">
        <Button variant="ghost" aria-label="Login">
          Sign in
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center">
    <Link href="/account" className="hidden sm:inline-flex">
      <Button variant="ghost" size="icon" aria-label="Account">
        <UserRound className="size-[18px]" />
      </Button>
    </Link>
      <SignOutButton />
    </div>
  );
}