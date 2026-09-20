import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          Extracurricular Dashboard
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Track activities, hours, and achievements in one place. The
          foundation is in place — features are coming soon.
        </p>
        <Link
          href="/dashboard"
          className="flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-300"
        >
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
