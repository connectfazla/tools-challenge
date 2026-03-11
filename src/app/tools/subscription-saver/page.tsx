"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Sub = { id: number; name: string; monthly: number; usedHours: number; keep: boolean };

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const seed: Sub[] = [
  { id: 1, name: "Streaming", monthly: 15, usedHours: 3, keep: true },
  { id: 2, name: "Music", monthly: 10, usedHours: 18, keep: true },
  { id: 3, name: "AI Tool", monthly: 20, usedHours: 2, keep: true },
  { id: 4, name: "Cloud Storage", monthly: 8, usedHours: 1, keep: true },
];

export default function SubscriptionSaverPage() {
  const [subs, setSubs] = useState<Sub[]>(seed);

  const stats = useMemo(() => {
    const totalMonthly = subs.reduce((sum, s) => sum + Math.max(0, s.monthly), 0);
    const keepMonthly = subs.filter((s) => s.keep).reduce((sum, s) => sum + Math.max(0, s.monthly), 0);
    const cutMonthly = totalMonthly - keepMonthly;
    const cutYearly = cutMonthly * 12;

    const lowUse = subs
      .filter((s) => s.usedHours <= 4)
      .map((s) => ({ ...s, costPerHour: s.monthly / Math.max(1, s.usedHours) }))
      .sort((a, b) => b.costPerHour - a.costPerHour);

    return { totalMonthly, keepMonthly, cutMonthly, cutYearly, lowUse };
  }, [subs]);

  const update = (id: number, patch: Partial<Sub>) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • Day 7</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Subscription Saver</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Inflation trend utility: audit monthly subscriptions, spot low-use services, and instantly see annual savings.
            </p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
          >
            Back to Tools
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h2 className="text-lg font-semibold">Your Subscriptions</h2>
            <div className="mt-4 grid gap-3">
              {subs.map((s) => (
                <article key={s.id} className="rounded-xl border border-[#e2e8f0] p-3">
                  <div className="grid gap-3 md:grid-cols-[1fr_110px_120px_auto] md:items-end">
                    <label className="grid gap-1 text-sm">
                      Name
                      <input
                        value={s.name}
                        onChange={(e) => update(s.id, { name: e.target.value })}
                        className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Monthly ($)
                      <input
                        type="number"
                        min={0}
                        value={s.monthly}
                        onChange={(e) => update(s.id, { monthly: Number(e.target.value || 0) })}
                        className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                      />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Hours used
                      <input
                        type="number"
                        min={0}
                        value={s.usedHours}
                        onChange={(e) => update(s.id, { usedHours: Number(e.target.value || 0) })}
                        className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                      />
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-2 text-sm">
                      <input type="checkbox" checked={s.keep} onChange={(e) => update(s.id, { keep: e.target.checked })} />
                      Keep
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h2 className="text-lg font-semibold">Savings Snapshot</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Row label="Current monthly total" value={money(stats.totalMonthly)} />
              <Row label="Planned monthly total" value={money(stats.keepMonthly)} />
              <Row label="Monthly savings" value={money(stats.cutMonthly)} emphasize={stats.cutMonthly > 0} />
              <Row label="Estimated annual savings" value={money(stats.cutYearly)} emphasize />
            </div>

            <div className="mt-5 rounded-xl bg-[#f1f5f9] px-3 py-3 text-xs text-[#475569]">
              <p className="font-medium text-[#334155]">Low-use alerts (≤4h/month)</p>
              {stats.lowUse.length ? (
                <ul className="mt-2 space-y-1">
                  {stats.lowUse.map((s) => (
                    <li key={s.id}>
                      {s.name || "Unnamed"}: {money(s.monthly)} / month (~{money(s.costPerHour)} per hour used)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">No low-use subscriptions detected.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Row({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#e2e8f0] px-3 py-2">
      <span className="text-[#475569]">{label}</span>
      <span className={emphasize ? "font-semibold text-[#0f172a]" : "font-medium"}>{value}</span>
    </div>
  );
}
