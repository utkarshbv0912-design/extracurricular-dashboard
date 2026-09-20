"use client";

import { useStubbedSave } from "@/components/settings/settings-form";
import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { initials } from "@/lib/format";
import { mockProfile } from "@/lib/mock/data";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

/** Account settings: session info, sign out, deletion placeholder. */
export default function AccountSettingsPage() {
  const { pending, save } = useStubbedSave();
  const router = useRouter();
  const email = "maya@example.com"; // Mock session email (backend phase).

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 text-base">
              {initials(mockProfile.display_name)}
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {mockProfile.display_name}
              </p>
              <p className="text-sm text-body">{email}</p>
            </div>
          </div>

          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              Session
            </h2>
            <p className="text-sm text-body">
              You&apos;re signed in as {email}. Sign out below — you can sign
              back in anytime.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-fit"
            disabled={pending}
            onClick={() =>
              save(async () => {
                // Stubbed sign-out; real session teardown in backend phase.
                await new Promise((resolve) => setTimeout(resolve, 400));
                router.push("/");
              })
            }
          >
            <LogOut aria-hidden className="h-4 w-4" /> Sign out
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <LightbulbMascot mood="thinking" className="h-10 w-10" />
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              Deleting your account
            </h2>
          </div>
          <p className="text-sm text-body">
            Account deletion isn&apos;t available in the MVP yet. When it
            arrives it will remove your records for good — nothing is deleted
            automatically in the meantime.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
