
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    Phone,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { authClient } from "@/lib/auth-client";
import {
    registerSchema,
    type RegisterFormValues,
} from "../_utils/schema";
import { OtpModal } from "./otp-modal";

function normalizeBangladeshPhone(phone: string) {
    const value = phone.replace(/[\s()-]/g, "");

    if (value.startsWith("+")) return value;
    if (value.startsWith("880")) return `+${value}`;
    if (value.startsWith("0")) return `+88${value}`;

    return value;
}

export default function RegisterForm() {
    const router = useRouter();

    const [showOtp, setShowOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [Message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        setErrorMessage("");
        setMessage("");
        setIsSubmitting(true);

        const normalizedPhone = normalizeBangladeshPhone(values.phone);

        try {
            const { error: signUpError } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                phone: normalizedPhone,
            });
            if (signUpError) {
                setErrorMessage(
                    signUpError.message || "Unable to create your account.",
                );
                return;
            }

            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email: values.email, // required, Email address to send the OTP.
                type: "email-verification", // required, Type of the OTP.
            });
            if (data?.success) {
                setMessage("A verification code has been sent to your email.");
                setShowOtp(true);
            }
            else {
                setMessage(error?.message || "An error occurred while sending the verification code.");
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-5"
            >
                <FormField
                    form={form}
                    id="register-name"
                    label="Full name"
                    name="name"
                    placeholder="Your name"
                    startIcon={UserRound}
                    required
                />

                <FormField
                    form={form}
                    id="register-phone"
                    label="Phone number"
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    startIcon={Phone}
                    required
                />

                <FormField
                    form={form}
                    id="register-email"
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    startIcon={Mail}
                    required
                />

                <FormField
                    form={form}
                    id="register-password"
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    startIcon={LockKeyhole}
                    endAction={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 size-8"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                    }
                    required
                />

                <FormField
                    form={form}
                    id="register-confirm-password"
                    label="Confirm password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    startIcon={LockKeyhole}
                    endAction={
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-2 size-8"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                    }
                    required
                />

                {errorMessage && (
                    <p className="text-sm text-destructive" role="alert">
                        {errorMessage}
                    </p>
                )}
                {Message && (
                    <p className="text-sm text-muted-foreground" role="status">
                        {Message}
                    </p>
                )}

                <Button type="submit" className="h-12" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Continue with verification"}
                    <ArrowRight className="ml-2 size-4" />
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                    By continuing, you agree to Neel&apos;s terms and privacy policy.
                </p>
            </form>

            {showOtp && (
                <OtpModal
                    email={form.getValues("email")}
                    onClose={() => setShowOtp(false)}
                    disableSession
                    onVerified={() => {
                        setShowOtp(false);
                        router.replace("/login");
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}
