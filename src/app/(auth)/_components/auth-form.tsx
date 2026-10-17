"use client";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { Card } from "@/components/ui/card";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export function AuthForm() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-md bg-muted p-1">
          <TabsTrigger
            value="login"
            className="rounded-sm font-semibold"
          >
            Login
          </TabsTrigger>

          <TabsTrigger
            value="register"
            className="rounded-sm font-semibold"
          >
            Register
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4 border-0 bg-transparent p-4 py-2 shadow-none">
          <TabsContents className="py-2">
            <TabsContent
              value="login"
              className="flex flex-col gap-6"
            >
              <LoginForm />
            </TabsContent>

            <TabsContent
              value="register"
              className="flex flex-col gap-6"
            >
              <RegisterForm />
            </TabsContent>
          </TabsContents>
        </Card>
      </Tabs>
    </div>
  );
}
