const services = [
  {
    title: "Brand Systems",
    description:
      "Identity systems that stay consistent across social, web, and performance creative.",
  },
  {
    title: "High-Intent SEO",
    description:
      "Localized, vertical-first SEO architecture that compounds monthly traffic and lead quality.",
  },
  {
    title: "Web Experience",
    description:
      "Fast, conversion-ready websites built as trust engines, not just digital brochures.",
  },
  {
    title: "Growth Loops",
    description:
      "Campaign + content loops that connect awareness to qualified pipeline.",
  },
];

const proof = [
  { label: "Regions Served", value: "MENA + EU + NA" },
  { label: "Core Focus", value: "Brand x Growth" },
  { label: "Delivery Model", value: "Embedded Team" },
  { label: "Approach", value: "Insight-led, KPI-driven" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(74,222,128,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.16),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(167,139,250,0.12),transparent_42%)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div className="text-lg font-semibold tracking-tight">Uppearance</div>
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/5">
          Book Discovery Call
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <section className="grid items-center gap-8 pb-14 pt-8 md:grid-cols-12 md:gap-10 md:pb-20 md:pt-14">
          <div className="md:col-span-7">
            <p className="mb-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
              Dubai-based digital growth partner
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl">
              Build a brand people remember.
              <span className="block text-white/65">Grow a business people choose.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base text-white/75 md:text-lg">
              Uppearance blends strategy, design, and performance to turn digital presence into
              measurable business outcomes. Every page, asset, and campaign is built to move
              prospects from curiosity to confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.02]">
                Get a Growth Roadmap
              </button>
              <button className="rounded-full border border-white/25 px-5 py-2.5 text-sm text-white/90 transition hover:bg-white/7">
                Explore Selected Work
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur-xl md:p-5">
              <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">Performance Snapshot</p>
                <div className="mt-4 grid gap-3">
                  {proof.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/25"
                    >
                      <p className="text-xs text-white/55">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-white/95">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-14 md:pb-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">What drives value</h2>
            <p className="hidden text-sm text-white/60 md:block">Built for mobile-first decision journeys</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((item) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-white/15 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.06]"
              >
                <div className="mb-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-300 opacity-80" />
                <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-3xl border border-white/15 bg-white/[0.03] p-5 md:grid-cols-3 md:items-center md:gap-6 md:p-7">
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Home concept v1</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Framer-clean aesthetics with award-style polish.
            </h3>
            <p className="mt-3 max-w-xl text-sm text-white/70 md:text-base">
              This page is intentionally lightweight, conversion-focused, and thumb-friendly on
              mobile. Next step: wire this to real case-study data, forms, and analytics events.
            </p>
          </div>
          <div className="flex md:justify-end">
            <button className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 px-4 py-3 text-sm font-semibold text-black md:w-auto">
              Start Project
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
