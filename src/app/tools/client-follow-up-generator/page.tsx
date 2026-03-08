"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Tone = "formal" | "friendly" | "urgent";

const toneLabels: Record<Tone, string> = {
  formal: "Formal",
  friendly: "Friendly",
  urgent: "Urgent",
};

function buildMessage(context: string, ask: string, tone: Tone, variant: number) {
  const openerByTone: Record<Tone, string[]> = {
    formal: [
      "Hi — following up on the note below.",
      "Quick follow-up regarding this thread.",
      "Circling back with a short follow-up.",
    ],
    friendly: [
      "Hey! Quick nudge on this 👋",
      "Just checking in on this when you have a minute.",
      "Friendly follow-up from my side.",
    ],
    urgent: [
      "Quick urgent follow-up on this.",
      "Flagging this as time-sensitive.",
      "Need to lock this in today if possible.",
    ],
  };

  const closerByTone: Record<Tone, string[]> = {
    formal: [
      "Thank you in advance.",
      "Appreciate your guidance.",
      "Thanks for your time.",
    ],
    friendly: ["Thanks a lot!", "Really appreciate it 🙌", "Thanks in advance!"],
    urgent: ["Thanks for a quick turnaround.", "Would appreciate a same-day reply.", "Please confirm as soon as possible."],
  };

  const opener = openerByTone[tone][variant % 3];
  const closer = closerByTone[tone][variant % 3];

  return `${opener}\n\nContext: ${context}\n\nCould you please ${ask}?\n\n${closer}`;
}

export default function ClientFollowUpGeneratorPage() {
  const [context, setContext] = useState("Proposal sent on Thursday for social media retainer. Waiting for approval to start next week.");
  const [ask, setAsk] = useState("confirm if we can proceed this week");
  const [tone, setTone] = useState<Tone>("friendly");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const variants = useMemo(() => {
    const cleanedContext = context.trim() || "our last discussion";
    const cleanedAsk = ask.trim() || "share an update";

    return [0, 1, 2].map((index) => buildMessage(cleanedContext, cleanedAsk, tone, index));
  }, [context, ask, tone]);

  const copyVariant = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1300);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tools Challenge • Day 4</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Client Follow-Up Generator</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
              Turn raw context into polished follow-up messages. Pick tone, generate 3 variants, copy, and send.
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
            <h2 className="text-base font-semibold">Input</h2>
            <p className="mt-1 text-sm text-slate-600">Add context and what you need from the recipient.</p>

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500">Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-400"
            />

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500">Call to action</label>
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-400"
            />

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500">Tone</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(toneLabels) as Tone[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTone(key)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    tone === key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {toneLabels[key]}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="text-base font-semibold">Ready-to-send variants</h2>
            <p className="mt-1 text-sm text-slate-600">Choose one, copy, and paste to WhatsApp, email, or Telegram.</p>

            <div className="mt-4 space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{variant}</pre>
                  <button
                    type="button"
                    onClick={() => copyVariant(variant, index)}
                    className="mt-3 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                  >
                    {copiedIndex === index ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
