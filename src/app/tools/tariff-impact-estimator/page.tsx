"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const pct = (n: number) => `${n.toFixed(1)}%`;
const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

export default function TariffImpactEstimatorPage() {
  const [unitCost, setUnitCost] = useState(22);
  const [quantity, setQuantity] = useState(1200);
  const [shipping, setShipping] = useState(2800);
  const [currentTariffRate, setCurrentTariffRate] = useState(5);
  const [newTariffRate, setNewTariffRate] = useState(18);
  const [targetMargin, setTargetMargin] = useState(35);

  const result = useMemo(() => {
    const goodsCost = unitCost * quantity;
    const preTariffLanded = goodsCost + shipping;

    const currentTariff = goodsCost * (currentTariffRate / 100);
    const newTariff = goodsCost * (newTariffRate / 100);

    const currentLanded = preTariffLanded + currentTariff;
    const newLanded = preTariffLanded + newTariff;

    const delta = newLanded - currentLanded;
    const deltaPct = currentLanded > 0 ? (delta / currentLanded) * 100 : 0;

    const currentBreakEvenUnit = currentLanded / quantity;
    const newBreakEvenUnit = newLanded / quantity;

    const currentTargetPrice = currentBreakEvenUnit / (1 - targetMargin / 100);
    const newTargetPrice = newBreakEvenUnit / (1 - targetMargin / 100);

    return {
      goodsCost,
      currentTariff,
      newTariff,
      currentLanded,
      newLanded,
      delta,
      deltaPct,
      currentBreakEvenUnit,
      newBreakEvenUnit,
      currentTargetPrice,
      newTargetPrice,
    };
  }, [unitCost, quantity, shipping, currentTariffRate, newTariffRate, targetMargin]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • Day 5</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Tariff Impact Estimator</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Model how a tariff change affects landed cost, break-even pricing, and margin-safe sell price before
              you commit a purchase order.
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
            <h2 className="text-lg font-semibold">Scenario Inputs</h2>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-1 text-sm">
                Unit cost (USD)
                <input
                  type="number"
                  min={0}
                  value={unitCost}
                  onChange={(e) => setUnitCost(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                Quantity
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                Shipping + handling (total USD)
                <input
                  type="number"
                  min={0}
                  value={shipping}
                  onChange={(e) => setShipping(Number(e.target.value || 0))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  Current tariff (%)
                  <input
                    type="number"
                    min={0}
                    value={currentTariffRate}
                    onChange={(e) => setCurrentTariffRate(Number(e.target.value || 0))}
                    className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  New tariff (%)
                  <input
                    type="number"
                    min={0}
                    value={newTariffRate}
                    onChange={(e) => setNewTariffRate(Number(e.target.value || 0))}
                    className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                  />
                </label>
              </div>
              <label className="grid gap-1 text-sm">
                Target gross margin (%)
                <input
                  type="number"
                  min={1}
                  max={95}
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Math.min(95, Math.max(1, Number(e.target.value || 1))))}
                  className="rounded-lg border border-[#cbd5e1] px-3 py-2"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5">
            <h2 className="text-lg font-semibold">Impact Snapshot</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Row label="Current landed cost" value={money(result.currentLanded)} />
              <Row label="New landed cost" value={money(result.newLanded)} />
              <Row label="Cost increase" value={`${money(result.delta)} (${pct(result.deltaPct)})`} emphasize />
              <Row label="Current break-even / unit" value={money(result.currentBreakEvenUnit)} />
              <Row label="New break-even / unit" value={money(result.newBreakEvenUnit)} />
              <Row label={`Current sell price for ${pct(targetMargin)} margin`} value={money(result.currentTargetPrice)} />
              <Row label={`New sell price for ${pct(targetMargin)} margin`} value={money(result.newTargetPrice)} />
            </div>

            <p className="mt-5 rounded-xl bg-[#f1f5f9] px-3 py-2 text-xs text-[#475569]">
              Quick read: you would need to raise your unit sell price by {money(result.newTargetPrice - result.currentTargetPrice)}
              to preserve a {pct(targetMargin)} gross margin under the new tariff.
            </p>
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
      <span className={emphasize ? "font-semibold text-[#b91c1c]" : "font-medium"}>{value}</span>
    </div>
  );
}
