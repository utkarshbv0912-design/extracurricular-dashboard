"use client";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

/**
 * Sign-up UI (stubbed submit). Copy sets the least-data expectation up
 * front: after signup we ask only for name, grade band, and interests.
 * States: pending submit, inline error, accessible labels.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!String(form.get("email") ?? "").trim() || !String(form.get("password") ?? "")) {
      setError("Enter an email and a password to create your account.");
      return;
    }
    setError(null);
    setPending(true);
    // Stub: pretend to create the account, then go set up the profile.
    setTimeout(() => {
      router.push("/onboarding");
    }, 600);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Next, we'll set up your profile — it takes about a minute."
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
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                aria-describedby="password-hint"
              />
              <p id="password-hint" className="text-xs text-faint">
                At least 8 characters.
              </p>
            </div>
            {error ? (
              <p
                role="alert"
                className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? <Spinner size="sm" label="" /> : null}
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </CardBody>
      </Card>
      <p className="mt-4 text-center text-sm text-body">
        Already have an account?{" "}
        <Link
          href="/auth/sign-in"
          className="font-medium text-accent-strong underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
