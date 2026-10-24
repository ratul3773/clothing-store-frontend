'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Tabs,
    TabsList,
    TabsContent,
} from '@/components/ui/tabs'
import SignUpForm from './signup-form'
import LoginForm from './login-form'
import { toast } from 'sonner'

export default function AuthForm() {

    const [tab, setTab] = useState("in")
    function handleTabChange(value: string) {
        setTab(value)
    }
    return (
        <Tabs
            value={tab}
            onValueChange={handleTabChange}
            className="overflow-y-auto mx-auto w-full max-w-lg p-5"
        >
            <TabsList
                value={tab}
                layoutId="auth-tab"
                variant="line"
                items={[
                    { value: 'in', label: 'Sign in' },
                    { value: 'up', label: 'Create account' },
                ]}
            />

            {/* Sign in */}
            <TabsContent value="in" className="mt-5 outline-none">
                <LoginForm />
            </TabsContent>

            {/* Registration */}
            <TabsContent value="up" className="mt-5 outline-none">
                <SignUpForm />
            </TabsContent>

            <div className="my-5 flex items-center gap-3 text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                <span className="label-mono">or</span>
                <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex justify-center">
            <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => {
                    // TODO: Connect Better Auth Google sign-in.
                    toast.info('Connect Google sign-in to Better Auth.')
                }}
            >
                Continue with Google
            </Button></div>
        </Tabs>
    );
}