/**
 * Admin layout shell. Protection is conceptual only in this phase — the
 * server-side guard (admin_roles check per ARCHITECTURE.md) arrives with
 * the backend phase. No student surface links here.
 */
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader />
      <div className="flex-1">{children}</div>
    </>
  );
}
