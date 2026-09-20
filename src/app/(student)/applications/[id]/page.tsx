"use client";

import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { daysUntil, deadlinePhrase, formatDate } from "@/lib/format";
import { mockApplications, mockOpportunities } from "@/lib/mock/data";
import { statusLabel, statusVariant } from "@/lib/status";
import { STATUS_TRANSITIONS, type ApplicationStatus } from "@/lib/taxonomy";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

/**
 * Application detail (PHASE_1_UX_PLAN.md §9): status transitions controlled
 * in the UI (DB does not enforce sequencing), editable notes, and stubbed
 * mutations until the backend phase.
 */
export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const app = mockApplications.find((a) => a.id === params.id);

  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(app?.notes ?? "");
  const [statusOpen, setStatusOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (!app) {
    return (
      <Container className="flex-1 py-16 text-center">
        <h1 className="font-drawn text-2xl font-semibold text-foreground">
          Application not found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-body">
          <Link
            href="/applications"
            className="text-accent-strong underline-offset-2 hover:underline"
          >
            Back to applications
          </Link>
          .
        </p>
      </Container>
    );
  }

  const opportunity = mockOpportunities.find(
    (o) => o.id === app.opportunity_id,
  );
  const title =
    app.off_catalog_title ?? opportunity?.title ?? "Application";
  const transitions = STATUS_TRANSITIONS[app.status];
  const days = daysUntil(app.deadline);

  async function changeStatus(next: ApplicationStatus) {
    setPending(true);
    // Stubbed status change; backend phase wires the server action.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPending(false);
    setStatusOpen(false);
    void next;
  }

  async function saveNotes() {
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setPending(false);
    setEditNotes(false);
  }

  return (
    <Container className="flex-1 max-w-2xl py-8">
      <Link
        href="/applications"
        className="text-sm text-accent-strong underline-offset-2 hover:underline"
      >
        ← Back to applications
      </Link>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="font-drawn text-2xl">{title}</CardTitle>
              <CardDescription>
                {opportunity ? (
                  <Link
                    href={`/opportunities/${opportunity.id}`}
                    className="underline-offset-2 hover:underline"
                  >
                    View listing
                  </Link>
                ) : (
                  "Off-catalog application"
                )}
              </CardDescription>
            </div>
            <Badge variant={statusVariant(app.status)}>
              {statusLabel(app.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 text-sm leading-6">
          <section className="flex flex-wrap items-center gap-2">
            <div>
              <h2 className="font-medium text-foreground">Deadline</h2>
              <p className="mt-0.5 text-body">
                {deadlinePhrase(app.deadline)} ({formatDate(app.deadline)})
                {days >= 0 && days <= 14 &&
                (app.status === "planned" || app.status === "in_progress")
                  ? " — coming up"
                  : ""}
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium text-foreground">Notes</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotes(app.notes);
                  setEditNotes((prev) => !prev);
                }}
              >
                {editNotes ? "Cancel" : "Edit notes"}
              </Button>
            </div>
            {editNotes ? (
              <div className="mt-2 flex flex-col gap-2">
                <Textarea
                  aria-label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveNotes} disabled={pending}>
                    {pending ? "Saving…" : "Save notes"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-1 whitespace-pre-line text-body">
                {app.notes || "No notes yet."}
              </p>
            )}
          </section>

          <section>
            <h2 className="font-medium text-foreground">History</h2>
            <p className="mt-0.5 text-xs text-faint">
              Created {formatDate(app.created_at)} · status changes appear here
              when tracking goes live.
            </p>
          </section>

          <div className="flex flex-wrap gap-2">
            <ButtonLink
              href={`/applications/${app.id}/edit`}
              size="sm"
              variant="outline"
            >
              <Pencil aria-hidden className="h-4 w-4" /> Edit
            </ButtonLink>
            {transitions.length > 0 ? (
              <Button size="sm" onClick={() => setStatusOpen(true)} disabled={pending}>
                Change status
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                title="Reopen arrives with the backend phase"
              >
                Reopen (terminal status)
              </Button>
            )}
            <Button variant="ghost" size="sm" disabled title="Arrives with the backend phase">
              <Trash2 aria-hidden className="h-4 w-4" /> Delete
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Status-change dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change status</DialogTitle>
            <DialogDescription>
              Current: {statusLabel(app.status)}. Pick the next state.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {transitions.map((status) => (
              <Button
                key={status}
                variant="outline"
                onClick={() => changeStatus(status)}
                disabled={pending}
              >
                {statusLabel(status)}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
