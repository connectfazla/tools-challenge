"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DomainRow = {
  domain: string;
  count: number;
  score: number;
  level: "High" | "Medium" | "Low";
  reason: string;
};

const defaultMine = `https://www.producthunt.com
https://www.reddit.com/r/SEO
https://medium.com/topic/marketing
https://www.linkedin.com/pulse/seo-case-study`;

const defaultCompetitors = `https://ahrefs.com/blog
https://searchengineland.com
https://moz.com/blog
https://www.producthunt.com
https://www.g2.com/categories/seo
https://www.reddit.com/r/marketing`;

const spamHints = ["casino", "bet", "adult", "xxx", "loan", "crypto-airdrop", "coupon"];

const getDomain = (value: string) => {
  const raw = value.trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return parsed.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const getQuality = (domain: string) => {
  let score = 50;
  const parts = domain.split(".");
  const tld = parts[parts.length - 1] || "";

  if (["com", "org", "net", "io", "co", "ai"].includes(tld)) score += 14;
  if (["gov", "edu"].includes(tld)) score += 24;
  if (domain.includes("reddit") || domain.includes("github") || domain.includes("medium")) score += 10;
  if (parts.length > 3) score -= 6;
  if (domain.length > 30) score -= 4;
  if (spamHints.some((hint) => domain.includes(hint))) score -= 32;

  const clamped = Math.max(0, Math.min(100, score));

  const level: DomainRow["level"] = clamped >= 72 ? "High" : clamped >= 48 ? "Medium" : "Low";
  const reason =
    level === "High"
      ? "Strong domain profile for outreach"
      : level === "Medium"
        ? "Potentially useful, review relevance first"
        : "Low signal quality or high spam risk";

  return { score: clamped, level, reason };
};

const asMap = (text: string) => {
  const map = new Map<string, number>();

  text
    .split(/\n|,|;/)
    .map((row) => getDomain(row))
    .filter(Boolean)
    .forEach((domain) => {
      map.set(domain, (map.get(domain) || 0) + 1);
    });

  return map;
};

export default function BacklinkFinderPage() {
  const [myLinks, setMyLinks] = useState(defaultMine);
  const [competitorLinks, setCompetitorLinks] = useState(defaultCompetitors);

  const analysis = useMemo(() => {
    const mineMap = asMap(myLinks);
    const compMap = asMap(competitorLinks);

    const opportunities: DomainRow[] = [];

    for (const [domain, count] of compMap.entries()) {
      if (mineMap.has(domain)) continue;
      const quality = getQuality(domain);
      opportunities.push({
        domain,
        count,
        score: quality.score,
        level: quality.level,
        reason: quality.reason,
      });
    }

    opportunities.sort((a, b) => b.score - a.score || b.count - a.count || a.domain.localeCompare(b.domain));

    const high = opportunities.filter((row) => row.level === "High").length;
    const medium = opportunities.filter((row) => row.level === "Medium").length;
    const low = opportunities.filter((row) => row.level === "Low").length;

    return {
      mineCount: mineMap.size,
      compCount: compMap.size,
      gapCount: opportunities.length,
      high,
      medium,
      low,
      opportunities,
    };
  }, [myLinks, competitorLinks]);

  const exportCsv = () => {
    const header = "domain,priority_score,priority_level,competitor_mentions,notes";
    const rows = analysis.opportunities.map(
      (row) => `${row.domain},${row.score},${row.level},${row.count},"${row.reason}"`,
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backlink-opportunities.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • SEO</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Backlink Finder</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Paste your backlink sources and competitor backlink sources. Instantly find backlink gap
              opportunities and prioritize outreach targets with a clean scoring model.
            </p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
          >
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h2 className="text-base font-semibold">Your existing backlinks</h2>
            <p className="mt-1 text-sm text-[#64748b]">One URL or domain per line (or comma-separated).</p>
            <textarea
              value={myLinks}
              onChange={(e) => setMyLinks(e.target.value)}
              className="mt-3 h-56 w-full rounded-xl border border-[#cbd5e1] bg-[#fcfdff] p-3 text-sm outline-none ring-0 focus:border-[#94a3b8]"
              placeholder="https://example.com/article"
            />
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h2 className="text-base font-semibold">Competitor backlinks</h2>
            <p className="mt-1 text-sm text-[#64748b]">Paste competitor source URLs to detect missed domains.</p>
            <textarea
              value={competitorLinks}
              onChange={(e) => setCompetitorLinks(e.target.value)}
              className="mt-3 h-56 w-full rounded-xl border border-[#cbd5e1] bg-[#fcfdff] p-3 text-sm outline-none ring-0 focus:border-[#94a3b8]"
              placeholder="https://competitor-source.com/post"
            />
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {[
            ["Your domains", analysis.mineCount],
            ["Competitor domains", analysis.compCount],
            ["Gap domains", analysis.gapCount],
            ["High priority", analysis.high],
            ["Medium", analysis.medium],
            ["Low", analysis.low],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-[#e2e8f0] bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-[#64748b]">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Backlink opportunities</h2>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
            >
              Export CSV
            </button>
          </div>

          {analysis.opportunities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 text-sm text-[#64748b]">
              No gap found yet. Add more competitor backlinks to discover opportunities.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-xs uppercase tracking-wide text-[#64748b]">
                    <th className="px-2 py-2">Domain</th>
                    <th className="px-2 py-2">Priority</th>
                    <th className="px-2 py-2">Mentions</th>
                    <th className="px-2 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.opportunities.slice(0, 100).map((row) => (
                    <tr key={row.domain} className="border-b border-[#f1f5f9] align-top">
                      <td className="px-2 py-3 font-medium">{row.domain}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            row.level === "High"
                              ? "bg-emerald-100 text-emerald-700"
                              : row.level === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {row.level} ({row.score})
                        </span>
                      </td>
                      <td className="px-2 py-3">{row.count}</td>
                      <td className="px-2 py-3 text-[#64748b]">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
