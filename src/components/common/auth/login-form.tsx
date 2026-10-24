
"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import AlertText from "@/components/common/Alert";
import { signInSchema, SignInValues } from "./auth.schemas";
import { OtpModal } from "./otp-form";
import { useLogin } from "@/hooks/useLogin";
import { FadeArc } from "@/components/animation/fade-arc";


export default function LoginForm() {
    const [otpOpen, setOtpOpen] = useState(false);
    const {
        onSubmit,
        errorMessage,
        setErrorMessage
    } = useLogin();
    const signInForm = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    })
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            {otpOpen ? (
                <OtpModal
                    email={signInForm.getValues("email")}
                    onVerified={() => {
                        setOtpOpen(false);
                    }}
                    onClose={() => {
                        setOtpOpen(false);
                    }}
                />
            ) : (
                <>
                    <form
                        noValidate
                        onSubmit={signInForm.handleSubmit(onSubmit)}
                        className="grid gap-5"
                    >
                        {errorMessage && (
                            <AlertText
                                title="Login Error"
                                description={errorMessage}
                                className="bg-destructive/3"
                                setSubmitError={setErrorMessage}
                                showCrossIcon={true}
                            />
                        )}
                        {/* {method === "password" ? ( */}
                        <>
                            <FormField
                                form={signInForm}
                                id="signin-email"
                                name="email"
                                label="Email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                startIcon={Mail}
                                required
                            />

                            <FormField
                                form={signInForm}
                                id="login-password"
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
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

                            <div className="text-right">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold underline underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </>
                        <Button
                            type="submit"
                            size="md"
                            className="mx-2"
                            disabled={signInForm.formState.isSubmitting}
                        >
                            {signInForm.formState.isSubmitting && (
                                <FadeArc/>
                            )}
                            {signInForm.formState.isSubmitting
                                ? 'Signing in...'
                                : 'Sign in'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </>
            )}
        </>
    );
}
