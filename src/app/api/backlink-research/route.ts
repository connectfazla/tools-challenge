import { NextRequest, NextResponse } from "next/server";

type SearchHit = {
  title: string;
  url: string;
  domain: string;
};

type Prospect = {
  domain: string;
  sourceUrl: string;
  title: string;
  score: number;
  level: "High" | "Medium" | "Low";
  type: string;
  reason: string;
};

const spamHints = ["casino", "bet", "adult", "porn", "xxx", "loan", "airdrop", "coupon", "essay"];

const classifyType = (domain: string, title: string) => {
  const s = `${domain} ${title}`.toLowerCase();
  if (s.includes("directory") || s.includes("yellow") || s.includes("listing")) return "Directory";
  if (s.includes("news") || s.includes("times") || s.includes("post")) return "News / Media";
  if (s.includes("blog") || s.includes("write for us") || s.includes("guest")) return "Blog / Guest Post";
  if (s.includes("magazine")) return "Magazine";
  return "Website";
};

const qualityScore = (domain: string, title: string) => {
  let score = 50;
  const str = `${domain} ${title}`.toLowerCase();
  const tld = domain.split(".").pop() || "";

  if (["com", "org", "net", "io", "co", "ae"].includes(tld)) score += 10;
  if (["gov", "edu"].includes(tld)) score += 20;
  if (str.includes("write for us") || str.includes("guest post")) score += 10;
  if (str.includes("directory") || str.includes("listing")) score += 8;
  if (str.includes("news") || str.includes("magazine")) score += 8;
  if (spamHints.some((x) => str.includes(x))) score -= 35;
  if (domain.split(".").length > 4) score -= 6;

  const clamped = Math.max(0, Math.min(100, score));
  const level: Prospect["level"] = clamped >= 72 ? "High" : clamped >= 48 ? "Medium" : "Low";
  const reason =
    level === "High"
      ? "Strong backlink target"
      : level === "Medium"
        ? "Relevant but needs manual review"
        : "Low quality or potential spam risk";

  return { score: clamped, level, reason };
};

const getDomain = (u: string) => {
  try {
    const url = new URL(u);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const decodeDuckHref = (href: string) => {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;

  try {
    const normalized = href.startsWith("http") ? href : `https://lite.duckduckgo.com${href}`;
    const u = new URL(normalized);
    const uddg = u.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
  } catch {
    return "";
  }

  return "";
};

const parseDuckResults = (html: string): SearchHit[] => {
  const hits: SearchHit[] = [];
  const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(html)) !== null) {
    const resolved = decodeDuckHref(m[1]);
    const title = m[2].replace(/<[^>]+>/g, "").trim();
    if (!resolved || !title) continue;

    const domain = getDomain(resolved);
    if (!domain) continue;
    if (domain.includes("duckduckgo.com")) continue;

    hits.push({ title, url: resolved, domain });
  }

  return hits;
};

export async function GET(req: NextRequest) {
  const keyword = req.nextUrl.searchParams.get("keyword")?.trim();
  const locale = req.nextUrl.searchParams.get("locale")?.trim() || "UAE";

  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  const footprints = [
    `"${keyword}" "write for us"`,
    `"${keyword}" "guest post"`,
    `"${keyword}" directory`,
    `"${keyword}" blog`,
    `"${keyword}" "submit article"`,
    `"${keyword}" "${locale}"`,
  ];

  const allHits: SearchHit[] = [];

  for (const q of footprints) {
    const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(q)}`;
    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "Mozilla/5.0",
        },
        cache: "no-store",
      });
      const html = await res.text();
      allHits.push(...parseDuckResults(html));
    } catch {
      // ignore per-query failures
    }
  }

  const map = new Map<string, Prospect>();

  for (const hit of allHits) {
    if (map.has(hit.domain)) continue;
    const q = qualityScore(hit.domain, hit.title);
    const type = classifyType(hit.domain, hit.title);
    map.set(hit.domain, {
      domain: hit.domain,
      sourceUrl: hit.url,
      title: hit.title,
      score: q.score,
      level: q.level,
      type,
      reason: q.reason,
    });
  }

  const prospects = [...map.values()]
    .filter((p) => p.level !== "Low")
    .sort((a, b) => b.score - a.score)
    .slice(0, 80);

  return NextResponse.json({ keyword, locale, total: prospects.length, prospects });
}
