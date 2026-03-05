"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Checks = {
  sourceKnown: boolean;
  primarySource: boolean;
  dateVisible: boolean;
  evidenceLinked: boolean;
  emotionalLanguage: boolean;
  urgentSharePrompt: boolean;
  aiImageWarning: boolean;
  crossChecked: boolean;
};

const defaultChecks: Checks = {
  sourceKnown: false,
  primarySource: false,
  dateVisible: false,
  evidenceLinked: false,
  emotionalLanguage: false,
  urgentSharePrompt: false,
  aiImageWarning: false,
  crossChecked: false,
};

export default function NewsTrustScorePage() {
  const [checks, setChecks] = useState<Checks>(defaultChecks);

  const score = useMemo(() => {
    let value = 50;

    if (checks.sourceKnown) value += 12;
    if (checks.primarySource) value += 12;
    if (checks.dateVisible) value += 8;
    if (checks.evidenceLinked) value += 12;
    if (checks.crossChecked) value += 14;

    if (checks.emotionalLanguage) value -= 10;
    if (checks.urgentSharePrompt) value -= 14;
    if (checks.aiImageWarning) value -= 10;

    return Math.max(0, Math.min(100, value));
  }, [checks]);

  const verdict =
    score >= 75
      ? { label: "Likely Reliable", tone: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" }
      : score >= 50
        ? { label: "Needs Verification", tone: "text-amber-700", bg: "bg-amber-50 border-amber-200" }
        : { label: "High Misinformation Risk", tone: "text-rose-700", bg: "bg-rose-50 border-rose-200" };

  const toggle = (key: keyof Checks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • Day 1</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">News Trust Score</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              A quick credibility check for viral posts and breaking headlines. Score first, then decide
              whether to share.
            </p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
          >
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h2 className="text-lg font-semibold">Credibility signals</h2>
            <p className="mt-1 text-sm text-[#64748b]">Check what applies to the post/article.</p>

            <div className="mt-4 space-y-2">
              {[
                ["sourceKnown", "The publisher/source is known and accountable"],
                ["primarySource", "It cites a primary source (official statement/data)"],
                ["dateVisible", "Publication date is visible and current"],
                ["evidenceLinked", "Claims include links, data, or documents"],
                ["crossChecked", "I cross-checked with at least one other reputable source"],
                ["emotionalLanguage", "Uses rage-bait/emotional language"],
                ["urgentSharePrompt", "Pressures me to share immediately"],
                ["aiImageWarning", "Image/video may be AI-generated or context-missing"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e2e8f0] p-3 text-sm hover:bg-[#f8fafc]"
                >
                  <input
                    type="checkbox"
                    checked={checks[key as keyof Checks]}
                    onChange={() => toggle(key as keyof Checks)}
                    className="mt-0.5 h-4 w-4 rounded border-[#cbd5e1] text-[#0f172a]"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
              <p className="text-sm text-[#64748b]">Confidence score</p>
              <p className="mt-2 text-5xl font-semibold tracking-tight">{score}</p>
              <p className="text-sm text-[#64748b]">out of 100</p>
              <div className="mt-4 h-2.5 w-full rounded-full bg-[#e2e8f0]">
                <div
                  className="h-2.5 rounded-full bg-[#0f172a] transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <div className={`rounded-2xl border p-5 md:p-6 ${verdict.bg}`}>
              <p className="text-xs uppercase tracking-[0.18em] text-[#64748b]">Verdict</p>
              <p className={`mt-2 text-xl font-semibold ${verdict.tone}`}>{verdict.label}</p>
              <p className="mt-3 text-sm text-[#475569]">
                {score >= 75
                  ? "Low immediate risk, but keep source context in mind before forwarding."
                  : score >= 50
                    ? "Pause and verify key claims before sharing."
                    : "Do not share yet. Verify source, date, and evidence first."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#475569]">Fast actions</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#475569]">
                <li>Reverse-search key image/video frames.</li>
                <li>Check who benefits if the claim spreads quickly.</li>
                <li>Look for missing date, location, or original context.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
