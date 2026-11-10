"use client";

import { SignInValues } from "@/components/common/auth/auth.schemas";
import { useStore } from "@/components/providers/StoreProvider";
import { authClient } from "@/lib/auth-client";
import { getErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { cartMergeNotice } from "@/lib/cart-merge";
import { useRouter } from "next/navigation";
import { cartApi } from "@/redux/apis/cart.api";
import { useAppDispatch } from "@/redux/hooks";

export function useLogin(isAdminLogin = false) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setAuthOpen } = useStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: SignInValues) {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setErrorMessage(error.message || "Unable to sign in.");
        return;
      }

      if (isAdminLogin) {
        // Hard reload: fresh server state and a clean client cache for the admin area.
        window.location.replace("/admin");
        return;
      }

      dispatch(cartApi.util.resetApiState()); // drop the guest cart + old version
      const mergeNotice = cartMergeNotice(data);
      if (mergeNotice) toast.info(mergeNotice);
      setAuthOpen(false);
      let destination = "/account";
      try {
        if (sessionStorage.getItem("orders:login-return") === "/cart")
          destination = "/cart";
        sessionStorage.removeItem("orders:login-return");
        sessionStorage.removeItem("orders:checkout");
      } catch {}
      router.replace(destination);
      router.refresh();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to sign in."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return { onSubmit, errorMessage, setErrorMessage, isSubmitting };
}
