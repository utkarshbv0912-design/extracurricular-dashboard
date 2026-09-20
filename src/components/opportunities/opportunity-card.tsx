import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Fade } from "@/components/ui/fade";
import { deadlinePhrase } from "@/lib/format";
import type { MockOpportunity } from "@/lib/mock/data";
import { Bookmark } from "lucide-react";
import Link from "next/link";

/**
 * OpportunityCard: shared listing card (PHASE_1_UX_PLAN.md §6). Status
 * overlays: saved bookmark; "Application tracked" badge; explainable match
 * reason. Deadline phrasing is calm/relative — never urgency-styled.
 * Saving happens on the detail page in this phase.
 */
export function OpportunityCard({
  opportunity,
  saved = false,
  tracked = false,
  matchReason,
  index = 0,
}: {
  opportunity: MockOpportunity;
  saved?: boolean;
  tracked?: boolean;
  matchReason?: string;
  index?: number;
}) {
  return (
    <Fade index={index}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardBody className="flex h-full flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="accent">{opportunity.category}</Badge>
            {matchReason ? <Badge>{matchReason}</Badge> : null}
            {tracked ? (
              <Badge variant="success">Application tracked</Badge>
            ) : null}
            {saved ? (
              <Badge variant="outline">
                <Bookmark aria-hidden className="h-3 w-3 fill-current" />
                Saved
              </Badge>
            ) : null}
          </div>
          <h3 className="text-base font-semibold leading-snug">
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="text-foreground underline-offset-2 hover:underline"
            >
              {opportunity.title}
            </Link>
          </h3>
          <p className="text-sm text-body">{opportunity.organization}</p>
          <p className="mt-auto text-xs text-faint">
            {deadlinePhrase(opportunity.deadline)}
            {opportunity.min_grade_level || opportunity.max_grade_level ? (
              <>
                {" · Grades "}
                {opportunity.min_grade_level ?? "9"}–
                {opportunity.max_grade_level ?? "12"}
              </>
            ) : null}
          </p>
        </CardBody>
      </Card>
    </Fade>
  );
}
