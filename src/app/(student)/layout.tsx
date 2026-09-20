import {
  MobileBottomBar,
} from "@/components/layout/mobile-bottom-bar";
import { StudentHeader } from "@/components/layout/student-header";

/**
 * Student layout: top header (desktop nav) + mobile bottom bar, with bottom
 * padding so content never hides behind the bar. Auth gating is conceptual
 * here — the session guard arrives with the backend phase.
 */
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock session user; replaced by the real session in the backend phase.
  const user = { name: "Maya", email: "maya@example.com" };

  return (
    <>
      <StudentHeader name={user.name} email={user.email} />
      <div className="flex-1 pb-24 md:pb-0">{children}</div>
      <MobileBottomBar />
    </>
  );
}
