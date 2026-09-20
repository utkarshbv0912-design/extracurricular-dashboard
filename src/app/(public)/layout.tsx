import { PublicHeader } from "@/components/layout/public-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Public layout: landing + auth pages. Simple chrome — public header,
 * footer, no bottom bar.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      {children}
      <SiteFooter />
    </>
  );
}
