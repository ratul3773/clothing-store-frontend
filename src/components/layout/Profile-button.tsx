import Link from "next/link";
import { Menu, MenuItem } from "../ui/controls";
import { ChevronDown, Heart, LayoutDashboard, Settings, ShoppingBag, User } from "lucide-react";
import { getServerSession } from "@/lib/auth-session";
import { Button } from "../ui/button";
import AuthFormTrigger from "./AuthFormTrigger";

export default async function ProfileButton() {
  // The decorative header must not take down a guest/cart page when the auth
  // backend times out. Route/API authorization still runs independently.
  const session = await getServerSession().catch(() => null);
  const isAuthenticated = session?.isAuthenticated ?? false;
  return (
    <>
      {isAuthenticated ? (
        <Menu trigger={
            <Button
              type="button"
              aria-label="Open account menu"
              size="sm"
              variant="ghost"
              className="group/profile h-10 gap-1 rounded-full px-2.5 sm:px-3"
            >
              <User size={19} aria-hidden="true" />
              <ChevronDown size={14} aria-hidden="true" className="transition-transform group-data-[state=open]/profile:rotate-180 motion-reduce:transition-none" />
            </Button>
        } 
        options={[
          { href: "/account", icon: <User aria-hidden="true" />, label: "My account" },
          { href: "/account?tab=orders", icon: <ShoppingBag aria-hidden="true" />, label: "My orders" },
          { href: "/account?tab=wishlist", icon: <Heart aria-hidden="true" />, label: "Wishlist" },
          { href: "/account?tab=settings", icon: <Settings aria-hidden="true" />, label: "Settings" },
        ]}
        />
      ) : (
        <AuthFormTrigger />
      )}
    </>
  );
}
