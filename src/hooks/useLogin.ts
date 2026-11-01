"use client";

import { SignInValues } from "@/components/common/auth/auth.schemas";
import { useStore } from "@/components/providers/StoreProvider";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@/lib/nav";
import { getErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cartMergeNotice } from "@/lib/cart-merge";


export function useLogin(isAdminLogin: boolean = false) {
const router = useRouter();
const navigateTo = useNavigate();
const {setAuthOpen} = useStore();
const [errorMessage, setErrorMessage] = useState<string>("");

async function onSubmit(values: SignInValues) {
    setErrorMessage("");
    try {
        const { data, error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });
        if (error) {
            setErrorMessage(error.message || "Unable to sign in.");
            return;
        }
        const mergeNotice = cartMergeNotice(data);
        if (mergeNotice) toast.info(mergeNotice);
        navigateTo(isAdminLogin ? "/admin" : "/account");
        router.refresh();
        setAuthOpen(false);
    } catch(error) {
        setErrorMessage(getErrorMessage(error, "Unable to sign in."));
    } 
}

return { onSubmit, errorMessage, setErrorMessage };
}