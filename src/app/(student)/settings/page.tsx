import { redirect } from "next/navigation";

/** /settings redirects to the first settings page. */
export default function SettingsIndexPage() {
  redirect("/settings/profile");
}
