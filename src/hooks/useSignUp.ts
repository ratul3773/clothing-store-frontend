"use client";

import { SignUpValues } from "@/components/common/auth/auth.schemas";
import { RESEND_COOLDOWN, RESEND_STORAGE_KEY } from "@/components/common/auth/otp-form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

function normalizeBangladeshPhone(phone: string) {
    const value = phone.replace(/[\s()-]/g, "");

    if (value.startsWith("+")) return value;
    if (value.startsWith("880")) return `+${value}`;
    if (value.startsWith("0")) return `+88${value}`;

    return value;
}
export function useSignUp() {
const [errorMessage, setErrorMessage] = useState<string>("");
const [showOtp, setShowOtp] = useState(false);

async function onSubmit(values: SignUpValues) {
        setErrorMessage("");

        const normalizedPhone = normalizeBangladeshPhone(values.phone);
        try {
            const { error: signUpError } = await authClient.signUp.email({
                name: values.name,
                email: values.email.trim(),
                password: values.password,
                phone: normalizedPhone,
            });
            if (signUpError) {
                setErrorMessage(
                    signUpError.message || "Unable to create your account.",
                );
                return;
            }
                const expiry = Date.now() + RESEND_COOLDOWN * 1000;
                localStorage.setItem(RESEND_STORAGE_KEY, String(expiry));
                toast.success("Verification code sent to your email.Please check your inbox and spam folder.");
                setShowOtp(true);
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        }
    }

return { onSubmit, errorMessage, setErrorMessage, showOtp, setShowOtp };
}