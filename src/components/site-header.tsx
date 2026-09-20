import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Extracurricular Dashboard
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
