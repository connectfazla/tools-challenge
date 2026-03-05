"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Prospect = {
  domain: string;
  type: string;
  country: string;
  niche: string;
  da: number;
  contactHint: string;
};

const prospects: Prospect[] = [
  { domain: "architecturaldigestme.com", type: "Magazine", country: "UAE", niche: "Interior Design", da: 78, contactHint: "Editorial pitch / design trends" },
  { domain: "designmiddleeast.com", type: "Industry Publication", country: "UAE", niche: "Interior Design", da: 64, contactHint: "Project feature submission" },
  { domain: "commercialinteriordesign.com", type: "Publication", country: "UAE", niche: "Interior Design", da: 67, contactHint: "Case study + images" },
  { domain: "whatson.ae", type: "Local Media", country: "UAE", niche: "Lifestyle", da: 71, contactHint: "Local business story" },
  { domain: "gulfbusiness.com", type: "Business Media", country: "UAE", niche: "Business", da: 73, contactHint: "Founder interview" },
  { domain: "zawya.com", type: "Regional News", country: "UAE", niche: "Business", da: 80, contactHint: "Press release" },
  { domain: "yallabiz.com", type: "Directory", country: "UAE", niche: "Local SEO", da: 58, contactHint: "Business profile listing" },
  { domain: "connect.ae", type: "Directory", country: "UAE", niche: "Local SEO", da: 55, contactHint: "Company listing" },
  { domain: "yellowpages-uae.com", type: "Directory", country: "UAE", niche: "Local SEO", da: 60, contactHint: "Business citation" },
  { domain: "gulfnews.com", type: "News", country: "UAE", niche: "General", da: 86, contactHint: "PR angle with local relevance" },
  { domain: "khaleejtimes.com", type: "News", country: "UAE", niche: "General", da: 85, contactHint: "Editorial story pitch" },
  { domain: "timeoutdubai.com", type: "Lifestyle Media", country: "UAE", niche: "Lifestyle", da: 75, contactHint: "Lifestyle / decor feature" },
  { domain: "houzz.com", type: "Portfolio Platform", country: "Global", niche: "Interior Design", da: 91, contactHint: "Create optimized profile" },
  { domain: "dezeen.com", type: "Architecture Media", country: "Global", niche: "Interior Design", da: 84, contactHint: "Unique project submission" },
  { domain: "archdaily.com", type: "Architecture Media", country: "Global", niche: "Interior Design", da: 89, contactHint: "Project publication" },
];

export default function BacklinkResearcherPage() {
  const [keyword, setKeyword] = useState("interior design");
  const [country, setCountry] = useState("UAE");
  const [minDa, setMinDa] = useState(60);
  const [approved, setApproved] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      const keywordHit = `${p.niche} ${p.type} ${p.domain}`.toLowerCase().includes(keyword.toLowerCase());
      const countryHit = country === "All" ? true : p.country === country;
      const daHit = p.da >= minDa;
      return keywordHit && countryHit && daHit;
    });
  }, [keyword, country, minDa]);

  const toggleApprove = (domain: string) => {
    setApproved((prev) => (prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]));
  };

  const exportApproved = () => {
    const rows = approved
      .map((d) => filtered.find((p) => p.domain === d) || prospects.find((p) => p.domain === d))
      .filter(Boolean) as Prospect[];

    const csv = [
      "domain,da,country,niche,type,contact_hint",
      ...rows.map((r) => `${r.domain},${r.da},${r.country},${r.niche},${r.type},"${r.contactHint}"`),
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
              Find and approve backlink opportunities by niche + location. Optimized for local SEO workflows in UAE.
            </p>
          </div>
          <Link href="/tools" className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]">
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 md:grid-cols-4 md:p-6">
          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Niche/Keyword</span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Country</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2">
              <option>UAE</option>
              <option>Global</option>
              <option>All</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block text-xs uppercase tracking-wide text-[#64748b]">Min DA</span>
            <input type="number" min={1} max={100} value={minDa} onChange={(e) => setMinDa(Number(e.target.value || 0))} className="w-full rounded-lg border border-[#cbd5e1] px-3 py-2" />
          </label>

          <div className="flex items-end">
            <button onClick={exportApproved} className="w-full rounded-lg border border-[#cbd5e1] bg-[#0f172a] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e293b]">
              Export Approved ({approved.length})
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Prospects ({filtered.length})</h2>
            <p className="text-xs text-[#64748b]">High DA + niche filtered</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-xs uppercase tracking-wide text-[#64748b]">
                  <th className="px-2 py-2">Domain</th>
                  <th className="px-2 py-2">DA</th>
                  <th className="px-2 py-2">Country</th>
                  <th className="px-2 py-2">Niche</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Contact Tip</th>
                  <th className="px-2 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isApproved = approved.includes(p.domain);
                  return (
                    <tr key={p.domain} className="border-b border-[#f1f5f9]">
                      <td className="px-2 py-3 font-medium">{p.domain}</td>
                      <td className="px-2 py-3">{p.da}</td>
                      <td className="px-2 py-3">{p.country}</td>
                      <td className="px-2 py-3">{p.niche}</td>
                      <td className="px-2 py-3">{p.type}</td>
                      <td className="px-2 py-3 text-[#64748b]">{p.contactHint}</td>
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
        </section>
      </div>
    </main>
  );
}
