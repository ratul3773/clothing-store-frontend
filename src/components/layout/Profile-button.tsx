import Link from "next/link";
import { Tip } from "../ui/controls";
import { Heart, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getServerSession } from "@/lib/auth-session";
import { Button } from "../ui/button";
import AuthFormTrigger from "./AuthFormTrigger";

export default async function ProfileButton() {
  const session = await getServerSession();
  const isAuthenticated = session.isAuthenticated;
  return (
    <>
      {isAuthenticated ? (
        <Tip label="My account">
          <Link href="/account" aria-label="Account">
            <Button
              aria-label="Account"
              size="icon"
              variant="ghost"
              className="h-10 w-10 place-items-center rounded-full"
            >
              <User size={19} />
            </Button>
          </Link>
        </Tip>
      ) : (
        <AuthFormTrigger />
      )}
    </>
  );
}