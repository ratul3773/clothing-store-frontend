"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useNavigate } from "@/lib/nav";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

export function useLogout() {
  const navigateTo = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const {error: err} = await authClient.signOut();
      if (err) {
        setError(getErrorMessage(err, "Failed to sign out"));
      } else {
        navigateTo("/");
      }
    } catch(error) {
      setError(getErrorMessage(error, "Failed to sign out"));
    } finally {
      setIsSigningOut(false);
    }
  };

  return { handleSignOut, isSigningOut, error };
}