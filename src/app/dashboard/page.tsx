import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Dashboard | Extracurricular Dashboard",
  description: "Your extracurricular activities at a glance.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          This is a placeholder. Dashboard features will be built here.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Activities", hint: "Coming soon" },
            { label: "Hours logged", hint: "Coming soon" },
            { label: "Achievements", hint: "Coming soon" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                {card.hint}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
