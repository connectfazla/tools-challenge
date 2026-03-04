import Link from "next/link";

const plan = [
  { day: "Day 1", date: "2026-03-05", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 2", date: "2026-03-06", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 3", date: "2026-03-07", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 4", date: "2026-03-08", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 5", date: "2026-03-09", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 6", date: "2026-03-10", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
  { day: "Day 7", date: "2026-03-11", title: "Trend-based tool (auto-generated)", status: "Scheduled" },
];

export default function ToolsLandingPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] px-5 py-10 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">7-Day Tools Challenge Hub</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              A minimal launchpad for the next 7 days of useful mini tools. This page will be updated
              each day after the new app goes live.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
          >
            Back to Home
          </Link>
        </div>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-4 md:p-6">
          <div className="grid gap-3">
            {plan.map((item) => (
              <article
                key={item.day}
                className="rounded-xl border border-[#e2e8f0] bg-[#fcfdff] px-4 py-4 md:px-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#64748b]">{item.day} • {item.date}</p>
                    <h2 className="mt-1 text-base font-medium md:text-lg">{item.title}</h2>
                  </div>
                  <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-medium text-[#3730a3]">
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[#64748b]">Link and summary will appear here after deployment.</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
