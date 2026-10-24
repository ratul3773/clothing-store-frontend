"use client";

import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@/lib/nav";
import { getErrorMessage } from "@/lib/utils";
import { useState } from "react";
import { OtpFormValues } from "@/components/common/auth/auth.schemas";
import { RESEND_COOLDOWN,RESEND_STORAGE_KEY } from "@/components/common/auth/otp-form";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

export function useOtp(
    email: string, 
    onVerified: () => void,
    otpForm: UseFormReturn<OtpFormValues>
) {
const navigateTo = useNavigate();
const [errorMessage, setErrorMessage] = useState<string>("");
const [isVerifying, setIsVerifying] = useState(false);
const [isResending, setIsResending] = useState(false);
const [resendSeconds, setResendSeconds] = useState(0);

    async function onSubmit(values: OtpFormValues) {
        setErrorMessage("");
        setIsVerifying(true);
        try {
            const { data, error } = await authClient.emailOtp.verifyEmail({
                email: email, // required, Email address to verify.
                otp: values.otp, // required, OTP to verify.
            });
            if (error) {
                setErrorMessage(error.message || "An error occurred during verification.");
            }
            else {
                onVerified();
                toast.success("Email verified successfully.You can now log in to your account.");
            }
        } catch {
            setErrorMessage("Verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    }

    async function resendCode() {
        setErrorMessage("");
        setIsResending(true);

        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: email, // required, Email address to send the OTP.
                type: "email-verification", // required, Type of the OTP.
            });

            if (error) {
                setErrorMessage(error.message || "Unable to resend the code.");
                return;
            }
            const expiry = Date.now() + RESEND_COOLDOWN * 1000;

            localStorage.setItem(RESEND_STORAGE_KEY, String(expiry));
            setResendSeconds(RESEND_COOLDOWN);
            otpForm.reset({ otp: "" });
            toast.success("A new verification code has been sent.");
        } catch (error) {
            setErrorMessage(getErrorMessage(error, "An error occurred while resending the code."));
        } finally {
            setIsResending(false);
        }
    }

return { 
    onSubmit, 
    errorMessage, 
    setErrorMessage,
    resendCode,
    setResendSeconds,
    isResending,
    resendSeconds,
    isVerifying
};
}