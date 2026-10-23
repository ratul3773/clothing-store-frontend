
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { otpSchema, SignUpValues, type OtpFormValues } from "./auth.schemas";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import AlertText from "../Alert";
import { useOtp } from "@/hooks/useOtp";

export const RESEND_COOLDOWN = 3 * 60;
export const RESEND_STORAGE_KEY = "email-otp-resend-expiry";

type OtpModalProps = {
    email: string;
    onClose: () => void;
    onVerified: () => void;
    disableSession?: boolean;
    errorMessage?: string;
};

export function OtpModal({
    email,
    onClose,
    onVerified,
    disableSession = false,
    errorMessage: initialErrorMessage = "",
}: OtpModalProps) {

    const otpForm = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
        mode: 'onChange',
    })
    const {
        onSubmit,
        errorMessage,
        setErrorMessage,
        resendCode,
        setResendSeconds,
        isResending,
        resendSeconds,
        isVerifying
    } = useOtp(email, onVerified, otpForm);
    const [timerReady, setTimerReady] = useState(false);

    useEffect(() => {
        const storedExpiry = localStorage.getItem(RESEND_STORAGE_KEY);
        const expiry = storedExpiry ? Number(storedExpiry) : 0;

        if (expiry > Date.now()) {
            setResendSeconds(
                Math.ceil((expiry - Date.now()) / 1000)
            );
        } else {
            localStorage.removeItem(RESEND_STORAGE_KEY);
            setResendSeconds(0);
        }

        setTimerReady(true);
    }, []);

    useEffect(() => {
        if (!timerReady || resendSeconds <= 0) return;

        const timer = window.setInterval(() => {
            const storedExpiry = Number(
                localStorage.getItem(RESEND_STORAGE_KEY) || 0
            );

            const remaining = Math.max(
                0,
                Math.ceil((storedExpiry - Date.now()) / 1000)
            );

            setResendSeconds(remaining);

            if (remaining === 0) {
                localStorage.removeItem(RESEND_STORAGE_KEY);
            }
        }, 1000);

        return () => window.clearInterval(timer);
    }, [timerReady, resendSeconds]);

    const formatTime = (seconds: number) =>
        `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60
        ).padStart(2, "0")}`;

    return (
        <form
            noValidate
            onSubmit={otpForm.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {errorMessage && (
                <AlertText
                    title="Error"
                    description={errorMessage}
                    setSubmitError={setErrorMessage}
                />
            )}
            <p className="text-sm text-muted-foreground">
                Enter the verification code sent to{' '}
                <span className="break-all font-medium text-foreground">
                    {email}
                </span>
                .
            </p>

            <InputOTP
                id="phone-verification-otp"
                maxLength={6}
                pattern="^[0-9]+$"
                value={otpForm.watch("otp")}
                onChange={(value) => {
                    otpForm.setValue("otp", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                    setErrorMessage("");
                }}
                disabled={isVerifying}
                aria-label="Six-digit verification code"
                aria-invalid={Boolean(otpForm.formState.errors.otp)}
            >
                <InputOTPGroup className="mx-auto gap-2">
                    {Array.from({ length: 3 }, (_, index) => (
                        <InputOTPSlot
                            key={index}
                            index={index}
                            className="size-10 rounded-md border text-lg sm:size-12"
                        />
                    ))}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="mx-auto gap-2">
                    {Array.from({ length: 3 }, (_, index) => (
                        <InputOTPSlot
                            key={index + 3}
                            index={index + 3}
                            className="size-10 rounded-md border text-lg sm:size-12"
                        />
                    ))}
                </InputOTPGroup>
            </InputOTP>

            {otpForm.formState.errors.otp && (
                <p className="text-sm text-destructive" role="alert">
                    {otpForm.formState.errors.otp.message}
                </p>
            )}

            <Button
                type="submit"
                size="md"
                className="w-full"
                variant="accent"
                disabled={otpForm.formState.isSubmitting}
            >
                {otpForm.formState.isSubmitting
                    ? 'Verifying...'
                    : 'Verify email'}
            </Button>
            <div className="flex items-center justify-end">
                <Button
                    type="button"
                    variant="link"
                    className="text-sm text-muted-foreground"
                    onClick={resendCode}
                    disabled={
                        !timerReady ||
                        isResending ||
                        isVerifying ||
                        resendSeconds > 0
                    }
                >
                    {isResending
                        ? "Sending..."
                        : resendSeconds > 0
                            ? `Resend code (${formatTime(resendSeconds)})`
                            : "Resend code"}
                </Button>
            </div>
        </form>
    );
}
