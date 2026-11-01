"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useNavigate } from "@/lib/nav";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/baseApi";

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigate();
  const router = useRouter();
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
        dispatch(baseApi.util.resetApiState());
        toast.success("Signed out successfully");
        navigateTo("/");
        router.refresh();
      }
    } catch(error) {
      setError(getErrorMessage(error, "Failed to sign out"));
    } finally {
      setIsSigningOut(false);
    }
  };

  return { handleSignOut, isSigningOut, error };
}