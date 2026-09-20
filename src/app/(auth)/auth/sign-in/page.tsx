"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

/**
 * Sign-in UI (stubbed submit — real auth arrives with the backend phase).
 * States: pending disabled submit + spinner, inline error, accessibilly
 * wired labels.
 */
export default function SignInPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!String(form.get("email") ?? "").trim() || !String(form.get("password") ?? "")) {
      setError("Enter your email and password to sign in.");
      return;
    }
    setError(null);
    setPending(true);
    // Stub: pretend to authenticate, then navigate to the dashboard.
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your dashboard."
    >
      <Card>
        <CardBody>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                aria-invalid={!!error}
                aria-describedby={error ? "signin-error" : undefined}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-accent-strong underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
                {/* forgot-password page is a planned route; link target arrives
                    with the backend phase. */}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "signin-error" : undefined}
              />
            </div>
            {error ? (
              <p
                id="signin-error"
                role="alert"
                className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" label="" /> : null}
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardBody>
      </Card>
      <p className="mt-4 text-center text-sm text-body">
        New here?{" "}
        <Link
          href="/auth/sign-up"
          className="font-medium text-accent-strong underline-offset-2 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
