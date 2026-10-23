"use client";

import { SignInValues } from "@/components/common/auth/auth.schemas";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@/lib/nav";
import { getErrorMessage } from "@/lib/utils";
import { useState } from "react";

export function useLogin() {
const navigateTo = useNavigate();
const [errorMessage, setErrorMessage] = useState<string>("");

async function onSubmit(values: SignInValues) {
    setErrorMessage("");
    try {
        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });
        if (error) {
            setErrorMessage(error.message || "Unable to sign in.");
            return;
        }
        navigateTo("/account");
    } catch(error) {
        setErrorMessage(getErrorMessage(error, "Unable to sign in."));
    } 
}

return { onSubmit, errorMessage, setErrorMessage };
}