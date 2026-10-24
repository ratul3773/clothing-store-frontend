
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import {
    signUpSchema,
    type SignUpValues,
} from "./auth.schemas";
import { OtpModal } from "./otp-form";
import AlertText from "../Alert";
import { useSignUp } from "@/hooks/useSignUp";
import PasswordStrength from "@/app/(store)/account/_components/PasswordStrength";
import { passwordRules } from "@/app/(store)/account/_schemas/account.schema";
import { FadeArc } from "@/components/animation/fade-arc";


export default function SignUpForm() {
    const {
        onSubmit,
        errorMessage,
        setErrorMessage,
        showOtp,
        setShowOtp
    } = useSignUp();
    const [showPassword, setShowPassword] = useState(false);
    
    const signUpForm = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    })
    const password = useWatch({
    control: signUpForm.control,
    name: "password",
    defaultValue: "",
});
    const rules = passwordRules(password)
    const score = rules.filter(([, ok]) => ok).length

    return (
        <>
            {errorMessage && (
                <AlertText
                    title="Error"
                    description={errorMessage}
                    setSubmitError={setErrorMessage}
                    className="mb-2"
                />
            )}
            {showOtp ? (
                <OtpModal
                    email={signUpForm.getValues("email")}
                    onVerified={() => {
                        setShowOtp(false);
                    }}
                    onClose={() => {
                        setShowOtp(false);
                    }}
                />
            ) : (
                <>
                    <form
                        noValidate
                        onSubmit={signUpForm.handleSubmit(onSubmit)}
                        className="grid gap-5"
                    >
                        <FormField
                            form={signUpForm}
                            id="register-name"
                            label="Full name"
                            name="name"
                            placeholder="Your name"
                            startIcon={UserRound}
                            required
                        />

                        <FormField
                            form={signUpForm}
                            id="register-phone"
                            label="Phone number"
                            name="phone"
                            placeholder="01XXXXXXXXX"
                            startIcon={Phone}
                            required
                        />

                        <FormField
                            form={signUpForm}
                            id="register-email"
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            startIcon={Mail}
                            required
                        />

                        <FormField
                            form={signUpForm}
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
                            form={signUpForm}
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
                        <PasswordStrength score={score} rules={rules} />
                        <Button
                            type="submit"
                            size="md"
                            className="mx-2"
                            disabled={signUpForm.formState.isSubmitting}
                        >
                            {signUpForm.formState.isSubmitting && (
                                <FadeArc />
                            )}
                            {signUpForm.formState.isSubmitting
                                ? 'Sending code...'
                                : 'Send email verification code'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <p className="text-center text-xs leading-5 text-muted-foreground">
                            By continuing, you agree to Neel&apos;s terms and privacy policy.
                        </p>
                    </form></>)}
        </>
    );
}
