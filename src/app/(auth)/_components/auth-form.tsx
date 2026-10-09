"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/form-field";
import { FieldLabel as Label } from "@/components/ui/field";

type AuthMode = "login" | "register";
type LoginMethod = "password" | "otp";

function PhoneField({
  id = "phone",
  label = "Phone number",
  value,
  onChange,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField
      id={id}
      label={label}
      type="tel"
      inputMode="tel"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="1XXXXXXXXX"
      required
    />
  );
}

function OtpModal({
  phone,
  onClose,
  onVerified,
}: {
  phone: string;
  onClose: () => void;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const verify = (event: React.SubmitEvent) => {
    event.preventDefault();
    if (otp.length !== 6) {
      setError("Enter the 6-digit code to continue.");
      return;
    }
    onVerified();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
    >
      <div className="fade-panel relative w-full max-w-md border border-border bg-background p-7 shadow-2xl sm:p-9">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close verification dialog"
          className="absolute right-4 top-4"
        >
          <X data-icon="inline-start" />
        </Button>
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent-foreground">
          <ShieldCheck className="size-6" />
        </div>
        <h2
          id="otp-title"
          className="mt-6 font-display text-3xl font-black tracking-[-0.04em] text-primary"
        >
          Verify your phone.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We sent a 6-digit code to{" "}
          <strong className="text-foreground">+880 {phone}</strong>. Enter it
          below to finish creating your account.
        </p>
        <form onSubmit={verify} className="mt-7 grid gap-4">
          <FormField
            id="register-otp"
            label="Verification code"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\\D/g, "").slice(0, 6));
              setError("");
            }}
            inputMode="numeric"
            autoFocus
            placeholder="000000"
            required
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="h-12">
            Verify and create account <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-sm text-muted-foreground"
          >
            Resend code
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AuthForm({
  mode,
  onSwitch,
}: {
  mode: AuthMode;
  onSwitch?: (mode: AuthMode) => void;
}) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState("");
  const isRegister = mode === "register";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (isRegister) {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      setShowOtp(true);
      return;
    }
    setMessage(
      loginMethod === "otp"
        ? `A verification code was sent to +880 ${phone}.`
        : "Demo sign-in submitted. Connect your auth provider to enable sessions.",
    );
  };
  return (
    <>
      <form
        onSubmit={submit}
        className="mt-9 grid gap-5 border-y border-border py-8"
      >
        {isRegister ? (
          <>
            <FormField
              id="register-name"
              label="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              startIcon={UserRound}
              required
            />
            <FormField
              id="register-phone"
              label="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01XXXXXXXXX"
              startIcon={Phone}
              required
            />
            <FormField
              id="register-email"
              label="Email address(optional)"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              startIcon={Mail}
            />
            <FormField
                  id="register-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                <FormField
                  id="register-confirm-password"
                  label="Confirm password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Your password"
                  startIcon={LockKeyhole}
                  endAction={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 size-8"
                    >
                      {showConfirm ? <EyeOff /> : <Eye />}
                    </Button>
                  }
                  required
                />
          </>
        ) : (
          <>
            <div className="flex border-b border-border">
              <Button
                type="button"
                variant={loginMethod === "password" ? "default" : "ghost"}
                onClick={() => setLoginMethod("password")}
                className="flex-1 rounded-b-none"
              >
                Phone or email
              </Button>
              <Button
                type="button"
                variant={loginMethod === "otp" ? "default" : "ghost"}
                onClick={() => setLoginMethod("otp")}
                className="flex-1 rounded-b-none"
              >
                Phone + OTP
              </Button>
            </div>
            {loginMethod === "password" ? (
              <>
                <FormField
                  id="login-identity"
                  label="Phone or email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="01XXXXXXXXX or you@example.com"
                />
                <FormField
                  id="login-password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
                      className="absolute right-2 top-2 size-8"
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
            ) : (
              <FormField
                id="login-phone"
                label="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="01XXXXXXXXX"
              />
            )}
          </>
        )}
        
        {message && (
          <p className="text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
        <Button type="submit" className="mt-1 h-12">
          {isRegister
            ? "Continue with phone verification"
            : loginMethod === "otp"
              ? "Send verification code"
              : "Sign in"}
          <ArrowRight className="ml-2 size-4" />
        </Button>
        {!isRegister && (
          <>
            <div className="relative py-1 text-center text-xs text-muted-foreground before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-border">
              <span className="relative bg-background px-3">
                or continue with
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-12"
              onClick={() =>
                setMessage(
                  "Google sign-in is ready for provider configuration.",
                )
              }
            >
              <span className="mr-2 font-bold text-[#4285F4]">G</span> Continue
              with Google
            </Button>
          </>
        )}
        <p className="text-center text-sm text-muted-foreground">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => onSwitch?.("login")}
                className="h-auto p-0 font-semibold"
              >
                Sign in
              </Button>
            </>
          ) : (
            <>
              New to Neel?{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => onSwitch?.("register")}
                className="h-auto p-0 font-semibold"
              >
                Create an account
              </Button>
            </>
          )}
        </p>
      </form>
      {isRegister && (
        <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <Check className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
          By continuing, you agree to Neel&apos;s terms and privacy policy.
        </p>
      )}
      {showOtp && (
        <OtpModal
          phone={phone}
          onClose={() => setShowOtp(false)}
          onVerified={() => {
            setShowOtp(false);
            setMessage(
              "Account created successfully. Connect your auth provider to persist this account.",
            );
          }}
        />
      )}
    </>
  );
}

export function AuthIntro({ mode }: { mode: AuthMode }) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">
        {mode === "register" ? "Join Neel" : "Neel account"}
      </p>
      <h1 className="mt-3 font-display text-5xl font-black tracking-[-0.06em] text-primary">
        {mode === "register" ? "Create your account." : "Welcome back."}
      </h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        {mode === "register"
          ? "Your everyday wardrobe, made personal. Register with your phone to keep orders and favourites together."
          : "Sign in to track orders, save favourites and make exchanges simple."}
      </p>
    </>
  );
}

export function AuthTabs({
  initialMode = "login",
}: {
  initialMode?: AuthMode;
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return (
    <div className="mx-auto max-w-xl">
      <div
        className="mb-9 grid grid-cols-2 border-b border-border"
        role="tablist"
        aria-label="Account access"
      >
        {(["login", "register"] as const).map((tab) => (
          <Button
            key={tab}
            type="button"
            variant={mode === tab ? "default" : "ghost"}
            role="tab"
            aria-selected={mode === tab}
            onClick={() => setMode(tab)}
            className="min-h-12 flex-1 rounded-b-none"
          >
            {tab === "login" ? "Sign in" : "Create account"}
          </Button>
        ))}
      </div>
      <div key={mode} className="page-transition" role="tabpanel">
        <AuthIntro mode={mode} />
        <AuthForm mode={mode} onSwitch={setMode} />
      </div>
    </div>
  );
}
