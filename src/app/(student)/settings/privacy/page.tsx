import { Card, CardBody } from "@/components/ui/card";
import { Check, X } from "lucide-react";

/**
 * Privacy page: plain-language restatement of the DATABASE_PLAN.md privacy
 * review — what we store, what we never store, who sees what.
 */
export const metadata = { title: "Privacy | Extracurricular Dashboard" };

export default function PrivacySettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              What we store
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-body">
              {[
                "Your display name, grade band, and interests",
                "Your activities, achievements, and their details",
                "Your saved opportunities and tracked applications",
                "Your matching preferences",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              What we never store
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-body">
              {[
                "Age or birthdate",
                "Home address or precise location",
                "School identity",
                "Phone number or parent contact information",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-drawn text-lg font-semibold text-foreground">
              Who can see what
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm text-body">
              <li>
                <strong className="text-foreground">You</strong> — everything
                you&apos;ve saved, tracked, and logged.
              </li>
              <li>
                <strong className="text-foreground">Admins</strong> — the
                opportunity catalog and problem reports. Never your private
                records.
              </li>
              <li>
                <strong className="text-foreground">Other students</strong> —
                nothing. Student-to-student access doesn&apos;t exist.
              </li>
            </ul>
          </div>
          <p className="text-xs text-faint">
            Technical detail lives in DATABASE_PLAN.md (privacy review) in the
            project repository.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
