"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function LayoffRunwayPlannerPage() {
  const [cash, setCash] = useState(9000);
  const [severance, setSeverance] = useState(4500);
  const [monthlyExpenses, setMonthlyExpenses] = useState(2400);
  const [expenseCutsPct, setExpenseCutsPct] = useState(15);
  const [monthlyIncome, setMonthlyIncome] = useState(600);

  const result = useMemo(() => {
    const cutRate = Math.max(0, Math.min(80, expenseCutsPct)) / 100;
    const adjustedExpenses = Math.max(0, monthlyExpenses * (1 - cutRate));
    const monthlyBurn = Math.max(0, adjustedExpenses - monthlyIncome);
    const totalBuffer = Math.max(0, cash + severance);
    const runwayMonths = monthlyBurn > 0 ? totalBuffer / monthlyBurn : Infinity;

    const safeBurn30 = totalBuffer / 30;
    const targetBurn6m = totalBuffer / 6;

    return {
      adjustedExpenses,
      monthlyBurn,
      totalBuffer,
      runwayMonths,
      safeBurn30,
      targetBurn6m,
    };
  }, [cash, severance, monthlyExpenses, expenseCutsPct, monthlyIncome]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • Day 6</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Layoff Runway Planner</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Trend-based practical tool: estimate how many months your emergency buffer lasts, and what monthly burn
              target keeps you stable while job searching.
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
            <h2 className="text-lg font-semibold">Your Inputs</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1 text-sm">
                Cash savings now (USD)
                <input
                  type="number"
                  min={0}
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                Severance / final payout (USD)
                <input
                  type="number"
                  min={0}
                  value={severance}
                  onChange={(e) => setSeverance(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                Current monthly expenses (USD)
                <input
                  type="number"
                  min={0}
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                Planned expense cuts (%)
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={expenseCutsPct}
                  onChange={(e) => setExpenseCutsPct(Math.max(0, Math.min(80, Number(e.target.value || 0))))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm">
                Side income / support per month (USD)
                <input
                  type="number"
                  min={0}
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h2 className="text-lg font-semibold">Runway Snapshot</h2>

            <div className="mt-4 grid gap-3 text-sm">
              <Row label="Total buffer" value={money(result.totalBuffer)} />
              <Row label="Adjusted monthly expenses" value={money(result.adjustedExpenses)} />
              <Row label="Net monthly burn" value={money(result.monthlyBurn)} emphasize={result.monthlyBurn > 0} />
              <Row
                label="Runway"
                value={Number.isFinite(result.runwayMonths) ? `${result.runwayMonths.toFixed(1)} months` : "Unlimited (non-negative cashflow)"}
                emphasize
              />
            </div>

            <div className="mt-5 rounded-xl bg-[#f1f5f9] px-3 py-3 text-xs text-[#475569]">
              <p>
                Keep monthly burn at or below <strong>{money(result.safeBurn30)}</strong> to target ~30 months of runway.
              </p>
              <p className="mt-2">
                For a 6-month safety target, monthly burn should stay near <strong>{money(result.targetBurn6m)}</strong>.
              </p>
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
