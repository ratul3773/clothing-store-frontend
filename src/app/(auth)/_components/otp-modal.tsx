
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck, X } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { authClient } from "@/lib/auth-client";
import { otpSchema, type OtpFormValues } from "../_utils/schema";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
    const [infoMessage, setInfoMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    async function onSubmit(values: OtpFormValues) {
        setErrorMessage("");
        setInfoMessage("");
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
            }
        } catch {
            setErrorMessage("Verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    }

    async function resendCode() {
        setErrorMessage("");
        setInfoMessage("");
        setIsResending(true);

        try {
            console.log("Resending code to email:", email);
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email: email, // required, Email address to send the OTP.
                type: "email-verification", // required, Type of the OTP.
            });

            if (error) {
                setErrorMessage(error.message || "Unable to resend the code.");
                return;
            }

            setInfoMessage("A new verification code has been sent.");
            form.reset({ otp: "" });
        } catch {
            setErrorMessage("Unable to resend the code. Please try again.");
        } finally {
            setIsResending(false);
        }
    }

    return (
        
<Dialog
  open={true}
  onOpenChange={(open) => {
    if (!open) onClose();
  }}
>
  <DialogContent className="w-[calc(100%-2rem)] max-w-md p-7 sm:p-9">

    <DialogHeader className="items-start text-left">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
        <ShieldCheck className="size-6" />
      </div>

      <DialogTitle className="mt-4 font-display text-3xl font-black tracking-[-0.04em] text-primary">
        Verify your email.
      </DialogTitle>

      <DialogDescription className="text-sm leading-6">
        Enter the verification code sent to{" "}
        <strong className="break-all text-foreground">{email}</strong>.
      </DialogDescription>
    </DialogHeader>

    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <label
          htmlFor="phone-verification-otp"
          className="text-sm font-medium"
        >
          Verification code
        </label>

        <InputOTP
          id="phone-verification-otp"
          maxLength={6}
          pattern="^[0-9]+$"
          value={form.watch("otp")}
          onChange={(value) => {
            form.setValue("otp", value, {
              shouldValidate: true,
              shouldDirty: true,
            });
            setErrorMessage("");
          }}
          disabled={isVerifying}
          aria-label="Six-digit verification code"
          aria-invalid={Boolean(form.formState.errors.otp)}
        >
          <InputOTPGroup className="mx-auto gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="size-10 rounded-md border text-lg sm:size-12"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {form.formState.errors.otp && (
          <p className="text-sm text-destructive" role="alert">
            {form.formState.errors.otp.message}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      {infoMessage && (
        <p className="text-sm text-muted-foreground" role="status">
          {infoMessage}
        </p>
      )}

      <Button
        type="submit"
        className="h-12"
        disabled={isVerifying}
      >
        {isVerifying ? "Verifying..." : "Verify code"}
        <ArrowRight className="ml-2 size-4" />
      </Button>

      <Button
        type="button"
        variant="link"
        className="text-sm text-muted-foreground"
        onClick={resendCode}
        disabled={isResending || isVerifying}
      >
        {isResending ? "Sending..." : "Resend code"}
      </Button>
    </form>
  </DialogContent>
</Dialog>

    );
}
