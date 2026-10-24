'use client'

import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Store } from 'lucide-react'
import { settings } from '@/data/site'
import { Card } from '@/components/cms/ui'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema, SignInValues } from "@/components/common/auth/auth.schemas";
import { useLogin } from '@/hooks/useLogin'
import AlertText from '@/components/common/Alert'
import { FormField } from '@/components/common/form-field'
import { CmsButton } from '@/components/ui/button'
import Link from 'next/link'

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const { onSubmit, errorMessage, setErrorMessage } = useLogin(true);
    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    return (
        <div className="cms grid min-h-dvh place-items-center p-4">
            <Card className="w-full max-w-sm p-6">
                <div className="mb-5 flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground"><Store className="size-4" /></span>
                    <div>
                        <p className="text-sm font-semibold">{settings.store.name} Admin</p>
                        <p className="text-xs text-muted-foreground">Sign in to continue</p>
                    </div>
                </div>
                <form
                    className="space-y-3"
                    onSubmit={form.handleSubmit(onSubmit)}
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
                    <>
                        <FormField
                            form={form}
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
                            form={form}
                            id="login-password"
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Your password"
                            startIcon={LockKeyhole}
                            endAction={
                                <CmsButton
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                    className="absolute right-2 top-1 size-8"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </CmsButton>
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
                    <CmsButton
                        type="submit"
                        size="md"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? 'Signing in...'
                            : 'Sign in'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </CmsButton>
                </form>
                <p className="mt-4 rounded bg-muted p-2 text-xs text-muted-foreground">Demo: {settings.admin.email} / {settings.admin.password}</p>
            </Card>
        </div>
    )
}
