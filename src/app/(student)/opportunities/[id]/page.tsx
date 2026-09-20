"use client";

import { LightbulbMascot } from "@/components/mascot/lightbulb-mascot";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { deadlinePhrase, formatDate } from "@/lib/format";
import {
  mockApplications,
  mockOpportunities,
  mockSavedIds,
} from "@/lib/mock/data";
import { Bookmark, CalendarCheck, ExternalLink, Flag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

/**
 * Opportunity detail (PHASE_1_UX_PLAN.md §6). Published rows only; draft/
 * archived mock rows render the not-found state (mirrors future RLS).
 * Save/report/track actions are stubbed client-side state until the
 * backend phase.
 */
export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const opportunity = mockOpportunities.find(
    (o) => o.id === params.id && o.status === "published",
  );

  const [saved, setSaved] = useState(mockSavedIds.includes(params.id));
  const [savePending, setSavePending] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportPending, setReportPending] = useState(false);
  const [reportReason, setReportReason] = useState("inaccurate");
  const [reportDetails, setReportDetails] = useState("");
  const [reported, setReported] = useState(false);

  if (!opportunity) {
    return (
      <Container className="flex-1 py-16 text-center">
        <LightbulbMascot mood="thinking" className="mx-auto h-24 w-24" />
        <h1 className="mt-4 font-drawn text-2xl font-semibold text-foreground">
          Opportunity not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          It may have been archived, or the link is off.{" "}
          <Link
            href="/opportunities"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to the finder
          </Link>
          .
        </p>
      </Container>
    );
  }

  const trackedApp = mockApplications.find(
    (app) =>
      app.opportunity_id === opportunity.id &&
      app.status !== "withdrawn",
  );

  async function onSave() {
    setSavePending(true);
    // Stubbed save toggle; real mutation arrives with the backend phase.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSaved((prev) => !prev);
    setSavePending(false);
  }

  async function onReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReportPending(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setReportPending(false);
    setReported(true);
    setReportOpen(false);
  }

  return (
    <Container className="flex-1 py-8">
      <Link
        href="/opportunities"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to opportunities
      </Link>

      <article className="mt-4 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="accent">{opportunity.category}</Badge>
            {trackedApp ? (
              <Badge variant="success">Application tracked</Badge>
            ) : null}
          </div>
          <h1 className="mt-3 font-drawn text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {opportunity.title}
          </h1>
          <p className="mt-1 text-body">{opportunity.organization}</p>

          <div className="mt-6 flex flex-col gap-4 text-sm leading-6">
            <section>
              <h2 className="font-medium text-foreground">About</h2>
              <p className="mt-1 text-body">{opportunity.description}</p>
            </section>
            <section>
              <h2 className="font-medium text-foreground">Eligibility</h2>
              <p className="mt-1 text-body">{opportunity.eligibility}</p>
            </section>
            <section>
              <h2 className="font-medium text-foreground">Deadline</h2>
              <p className="mt-1 text-body">
                {deadlinePhrase(opportunity.deadline)} (
                {formatDate(opportunity.deadline)})
              </p>
            </section>
            <section>
              <h2 className="font-medium text-foreground">Apply</h2>
              <p className="mt-1 text-body">
                Applications happen on the organizer&apos;s site.{" "}
                <a
                  href={opportunity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent-strong underline-offset-2 hover:underline"
                >
                  Open the official listing{" "}
                  <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Action rail */}
        <aside className="lg:w-72">
          <Card className="lg:sticky lg:top-24">
            <CardBody className="flex flex-col gap-3">
              {trackedApp ? (
                <>
                  <ButtonLink href={`/applications/${trackedApp.id}`}>
                    View application
                  </ButtonLink>
                  <Button variant="outline" onClick={onSave} disabled={savePending}>
                    {savePending ? (
                      <Spinner size="sm" label="" />
                    ) : (
                      <Bookmark aria-hidden className="h-4 w-4" />
                    )}
                    {saved ? "Remove save" : "Apply again"}
                  </Button>
                </>
              ) : (
                <>
                  <ButtonLink href={`/applications/new?opportunity=${opportunity.id}`}>
                    <CalendarCheck aria-hidden className="h-4 w-4" />
                    Track application
                  </ButtonLink>
                  <Button variant="outline" onClick={onSave} disabled={savePending}>
                    {savePending ? (
                      <Spinner size="sm" label="" />
                    ) : (
                      <Bookmark
                        aria-hidden
                        className={
                          "h-4 w-4 " + (saved ? "fill-current" : "")
                        }
                      />
                    )}
                    {saved ? "Saved" : "Save"}
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => setReportOpen(true)}
                disabled={reported}
              >
                <Flag aria-hidden className="h-4 w-4" />
                {reported ? "Reported — under review" : "Report a problem"}
              </Button>
              <p className="text-xs text-faint">
                Only you can see your saves and tracked applications.
              </p>
            </CardBody>
          </Card>
        </aside>
      </article>

      {/* Report dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
            <DialogDescription>
              Tell us what&apos;s wrong with this listing. An admin will take
              a look.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onReport} className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-foreground">
                Reason
              </legend>
              {["inaccurate", "expired", "inappropriate", "other"].map(
                (reason) => (
                  <label key={reason} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="report-reason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={() => setReportReason(reason)}
                    />
                    {reason.charAt(0).toUpperCase() + reason.slice(1)}
                  </label>
                ),
              )}
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="report-details"
                className="text-sm font-medium text-foreground"
              >
                Details (optional)
              </label>
              <Textarea
                id="report-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="What's wrong?"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={reportPending}>
                {reportPending ? <Spinner size="sm" label="" /> : null}
                {reportPending ? "Sending…" : "Send report"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
