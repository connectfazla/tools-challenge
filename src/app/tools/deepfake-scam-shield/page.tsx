"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Signal = {
  id: string;
  label: string;
  hint: string;
  weight: number;
};

const signals: Signal[] = [
  {
    id: "urgent-money",
    label: "Urgent money ask",
    hint: "They push immediate transfer, crypto, gift cards, or wire before verification.",
    weight: 26,
  },
  {
    id: "identity-pressure",
    label: "Claims to be family/boss but blocks verification",
    hint: "They avoid callback, safe word, or a second channel confirmation.",
    weight: 24,
  },
  {
    id: "voice-video-odd",
    label: "Voice/video feels off",
    hint: "Unnatural pauses, lip-sync mismatch, robotic artifacts, or frozen expressions.",
    weight: 18,
  },
  {
    id: "secrecy",
    label: "Tells you to keep it secret",
    hint: "Requests silence from spouse, colleagues, bank, or friends.",
    weight: 14,
  },
  {
    id: "new-account",
    label: "Payment destination changed",
    hint: "Suddenly asks to pay a new account/wallet or different vendor details.",
    weight: 12,
  },
  {
    id: "fear-hook",
    label: "Fear + authority pressure",
    hint: "Police/legal/threat language designed to force fast compliance.",
    weight: 6,
  },
];

function riskBand(score: number) {
  if (score >= 70) return { label: "High Risk", tone: "text-rose-700 bg-rose-100 border-rose-200" };
  if (score >= 35) return { label: "Medium Risk", tone: "text-amber-700 bg-amber-100 border-amber-200" };
  return { label: "Low Risk", tone: "text-emerald-700 bg-emerald-100 border-emerald-200" };
}

export default function DeepfakeScamShieldPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const score = useMemo(() => {
    return Math.min(
      100,
      selected.reduce((total, id) => {
        const signal = signals.find((s) => s.id === id);
        return total + (signal?.weight ?? 0);
      }, 0),
    );
  }, [selected]);

  const band = riskBand(score);

  const steps = useMemo(() => {
    if (score >= 70) {
      return [
        "Stop all payments immediately.",
        "Switch channels: call the person/organization using your saved contact.",
        "Use a verification phrase or callback through a trusted number.",
        "Report to your bank/payment provider and local cybercrime hotline.",
      ];
    }

    if (score >= 35) {
      return [
        "Pause the conversation and do a second-channel verification.",
        "Ask a question only the real person would know.",
        "Confirm account details from your own records, not the message.",
        "Do not install apps or share OTP/recovery codes.",
      ];
    }

    return [
      "Keep normal caution and verify before any money movement.",
      "Save and use a family/team safe word for urgent requests.",
      "Enable transfer limits and payment alerts.",
      "Bookmark official support numbers in advance.",
    ];
  }, [score]);

  const toggle = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tools Challenge • Day 3</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Deepfake Scam Shield</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              Quick risk triage for suspicious voice/video requests. Check warning signals and get an action plan
              in under 30 seconds.
            </p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="text-base font-semibold">Signal Checklist</h2>
            <p className="mt-1 text-sm text-slate-600">Select every warning sign that matches what you saw/heard.</p>

            <div className="mt-4 space-y-3">
              {signals.map((signal) => {
                const active = selected.includes(signal.id);
                return (
                  <button
                    key={signal.id}
                    type="button"
                    onClick={() => toggle(signal.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-sky-400 bg-sky-50 shadow-[0_0_0_1px_rgba(56,189,248,.35)]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-medium">{signal.label}</p>
                    <p className="mt-1 text-xs text-slate-600">{signal.hint}</p>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="text-base font-semibold">Risk Result</h2>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Current score</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-4xl font-semibold tracking-tight">{score}</p>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${band.tone}`}>{band.label}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${score}%` }} />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium">What to do now</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                {steps.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span className="mt-[2px] inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Not legal advice. Use this as a quick filter before any payment or sensitive data sharing.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
