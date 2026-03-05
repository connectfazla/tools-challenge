"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Prospect = {
  domain: string;
  sourceUrl: string;
  title: string;
  score: number;
  level: "High" | "Medium" | "Low";
  type: string;
  reason: string;
};

export default function BacklinkResearcherPage() {
  const [keyword, setKeyword] = useState("interior design dubai");
  const [locale, setLocale] = useState("UAE");
  const [minScore, setMinScore] = useState(60);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Prospect[]>([]);
  const [approved, setApproved] = useState<string[]>([]);

  const filtered = useMemo(() => results.filter((r) => r.score >= minScore), [results, minScore]);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/backlink-research?keyword=${encodeURIComponent(keyword)}&locale=${encodeURIComponent(locale)}`);
      const data = await res.json();
      setResults(data.prospects || []);
      setApproved([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleApprove = (domain: string) => {
    setApproved((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]));
  };

  const exportApproved = () => {
    const rows = filtered.filter((r) => approved.includes(r.domain));
    const csv = [
      "domain,priority_score,priority_level,type,source_url,notes",
      ...rows.map((r) => `${r.domain},${r.score},${r.level},${r.type},${r.sourceUrl},"${r.reason}"`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "approved-backlinks.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • SEO</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Backlink Researcher</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Enter a keyword, scan the web for relevant backlink opportunities, then approve and export your target list.
            </p>
          </div>
          <Link href="/tools" className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]">
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 md:grid-cols-4 md:p-6">
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Keyword</span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Local SEO market</span>
            <select value={locale} onChange={(e) => setLocale(e.target.value)} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2">
              <option>UAE</option>
              <option>Saudi Arabia</option>
              <option>Qatar</option>
              <option>All</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Min quality score</span>
            <input type="number" min={1} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value || 0))} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2" />
          </label>

          <div className="flex items-end gap-2">
            <button onClick={search} className="w-full rounded-lg bg-[#0f172a] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e293b]">
              {loading ? "Searching..." : "Search backlinks"}
            </button>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[#64748b]">Found</p>
            <p className="mt-1 text-2xl font-semibold">{filtered.length}</p>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[#64748b]">Approved</p>
            <p className="mt-1 text-2xl font-semibold">{approved.length}</p>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <button onClick={exportApproved} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm font-medium hover:bg-[#f1f5f9]">
              Export Approved CSV
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Opportunities</h2>
            <p className="text-xs text-[#64748b]">Quality-filtered backlink prospects</p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 text-sm text-[#64748b]">
              Run a search to generate backlink opportunities.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-left text-xs uppercase tracking-wide text-[#64748b]">
                    <th className="px-2 py-2">Domain</th>
                    <th className="px-2 py-2">Score</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Source</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const isApproved = approved.includes(p.domain);
                    return (
                      <tr key={p.domain} className="border-b border-[#f1f5f9]">
                        <td className="px-2 py-3">
                          <p className="font-medium">{p.domain}</p>
                          <p className="text-xs text-[#64748b]">{p.reason}</p>
                        </td>
                        <td className="px-2 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              p.level === "High"
                                ? "bg-emerald-100 text-emerald-700"
                                : p.level === "Medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {p.level} ({p.score})
                          </span>
                        </td>
                        <td className="px-2 py-3">{p.type}</td>
                        <td className="px-2 py-3">
                          <a href={p.sourceUrl} target="_blank" className="text-[#2563eb] underline" rel="noreferrer">
                            Open source
                          </a>
                        </td>
                        <td className="px-2 py-3">
                          <button
                            onClick={() => toggleApprove(p.domain)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isApproved ? "bg-emerald-100 text-emerald-700" : "bg-[#eef2ff] text-[#3730a3]"
                            }`}
                          >
                            {isApproved ? "Approved" : "Approve"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
