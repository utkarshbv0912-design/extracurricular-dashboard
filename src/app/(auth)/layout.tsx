/**
 * Auth layout: focused flows with no competing navigation (PHASE_1_UX_PLAN.md
 * §2). PublicHeader hides its account CTAs on auth pages; no footer to keep
 * the flow minimal.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
