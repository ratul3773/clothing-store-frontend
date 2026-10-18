
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginFormValues } from "../_utils/schema";
import { OtpModal } from "./otp-modal";
import AlertText from "@/components/common/Alert";

type LoginMethod = "password" | "otp";

function normalizeBangladeshPhone(phone: string) {
    const value = phone.replace(/[\s()-]/g, "");

    if (value.startsWith("+")) return value;
    if (value.startsWith("880")) return `+${value}`;
    if (value.startsWith("0")) return `+88${value}`;

    return value;
}

export default function LoginForm() {
    const router = useRouter();

    const [method, setMethod] = useState<LoginMethod>("password");
    const [showOtp, setShowOtp] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onPasswordSubmit(values: LoginFormValues) {
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const { error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
            });
            if (error) {
                if(error.code === "EMAIL_NOT_VERIFIED") {
                    setErrorMessage("Email not verified. Please check your inbox for the verification email.");
                    setShowOtp(true);
                    return;
                }
                setErrorMessage(error.message || "Unable to sign in.");
                return;
            }

            router.replace("/account");
            router.refresh();
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    //   async function onPhoneSubmit(values: LoginFormValues) {
    //     setErrorMessage("");
    //     setIsSubmitting(true);

    //     const normalizedPhone = normalizeBangladeshPhone(values.phone);

    //     try {
    //       const { error } = await authClient.phoneNumber.sendOtp({
    //         phoneNumber: normalizedPhone,
    //       });

    //       if (error) {
    //         setErrorMessage(error.message || "Unable to send the OTP.");
    //         return;
    //       }

    //       setPhoneNumber(normalizedPhone);
    //       setShowOtp(true);
    //     } catch {
    //       setErrorMessage("Something went wrong while sending the OTP.");
    //     } finally {
    //       setIsSubmitting(false);
    //     }
    //   }

    return (
        <>
            {/* <div className="flex border-b border-border">
                <Button
                    type="button"
                    variant={method === "password" ? "default" : "ghost"}
                    onClick={() => {
                        setMethod("password");
                        setErrorMessage("");
                    }}
                    className="flex-1 rounded-b-none"
                >
                    Email & password
                </Button>

                <Button
                    type="button"
                    variant={method === "otp" ? "default" : "ghost"}
                    onClick={() => {
                        setMethod("otp");
                        setErrorMessage("");
                    }}
                    className="flex-1 rounded-b-none"
                >
                    Phone OTP
                </Button>
            </div> */}

            <form
                onSubmit={form.handleSubmit(
                    onPasswordSubmit
                    //   method === "password" ? onPasswordSubmit : onPhoneSubmit,
                )}
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
                        form={form}
                        id="login-email"
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        startIcon={Mail}
                        required
                    />

                    <FormField
                        form={form}
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
                {/* ) : (
        //   <FormField
        //     form={form}
        //     id="login-phone"
        //     label="Phone number"
        //     // name="phone"
        //     placeholder="01XXXXXXXXX"
        //     startIcon={Phone}
        //     required
        //   />
        )} */}

                <Button type="submit" className="h-12" disabled={isSubmitting}>
                    {isSubmitting
                        ? "Please wait..."
                        : method === "password"
                            ? "Sign in"
                            : "Send verification code"}
                    <ArrowRight className="ml-2 size-4" />
                </Button>
            </form>

            {showOtp && (
                <OtpModal
                    email={form.getValues("email")}
                    onClose={() => setShowOtp(false)}
                    disableSession={false}
                    errorMessage={errorMessage}
                    onVerified={() => {
                        setShowOtp(false);
                        router.replace("/account");
                        router.refresh();
                    }}
                />
            )}
        </>
    );
}
