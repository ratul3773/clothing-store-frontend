"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { toggleWishlist } from "@/lib/redux/slices/preferences-slice";

interface WishlistButtonProps {
  slug: string;
  name: string;
  variant?: "overlay" | "outline";
  className?: string;
}

export function WishlistButton({
  slug,
  name,
  variant = "overlay",
  className,
}: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.preferences.wishlist.includes(slug));

  const onClick = () => {
    dispatch(toggleWishlist(slug));
    toast(
      saved ? `Removed ${name} from wishlist` : `Saved ${name} to wishlist`,
    );
  };

  return (
    <Button
      type="button"
      variant={variant === "outline" ? "outline" : "ghost"}
      size={variant === "outline" ? "icon" : "icon-sm"}
      aria-pressed={saved}
      aria-label={
        saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`
      }
      onClick={onClick}
      className={cn(
        variant === "overlay" &&
          "rounded-full bg-card/90 text-foreground backdrop-blur-sm hover:bg-card",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          saved && "fill-destructive text-destructive",
        )}
      />
    </Button>
  );
}
