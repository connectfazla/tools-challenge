import Link from "next/link";

const services = [
  {
    title: "SEO Strategy & Growth",
    text: "Keyword strategy, technical audits, and content systems designed to increase qualified traffic and leads.",
  },
  {
    title: "WordPress Development",
    text: "Fast, secure, conversion-focused WordPress websites with clean architecture and scalable page structures.",
  },
  {
    title: "Local SEO (UAE)",
    text: "Location-focused optimization for service businesses that need better visibility in Dubai and nearby markets.",
  },
  {
    title: "Performance Optimization",
    text: "Core Web Vitals tuning, image optimization, and technical fixes to improve UX and search performance.",
  },
];

const process = [
  "Discovery & business goals mapping",
  "SEO + technical baseline audit",
  "Roadmap with priority actions",
  "Execution (development + optimization)",
  "Reporting, iteration, and scale",
];

const reviews = [
  {
    quote:
      "Sakib turned our outdated site into a fast lead machine. Rankings improved and conversion quality got better within weeks.",
    who: "Founder, Interior Design Studio",
  },
  {
    quote:
      "Clear communication, strong technical delivery, and a strategy that actually made business sense—not vanity metrics.",
    who: "Marketing Manager, B2B Services",
  },
  {
    quote:
      "From SEO structure to WordPress performance, the whole process felt premium and organized.",
    who: "Director, Real Estate Brand",
  },
];

export default function SakibAhmedLandingPage() {
  return (
    <main className="min-h-screen bg-[#090909] text-[#f5f5f5]">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-sm tracking-[0.2em] text-white/70 uppercase">Sakib Ahmed</p>
          <a
            href="https://www.linkedin.com/in/ahmed-sakib-upp/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            LinkedIn
          </a>
        </header>

        <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-8">
            <p className="text-xs uppercase tracking-[0.24em] text-white/60">SEO Expert & WordPress Developer</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              I build search-driven websites that look minimal and perform hard.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/70 md:text-lg">
              I help brands grow with strategic SEO and high-performance WordPress development—focused on
              real traffic, real leads, and long-term visibility.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:hello@sakibahmed.com"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
              >
                Book a Discovery Call
              </a>
              <a
                href="#work"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:bg-white/10"
              >
                View Work
              </a>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Core Focus</p>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li>• Technical SEO</li>
                <li>• On-page architecture</li>
                <li>• WordPress custom build</li>
                <li>• Local SEO positioning</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-white/10 py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">About</h2>
          <p className="mt-4 max-w-4xl text-white/70">
            I combine SEO thinking with development execution. Instead of separating strategy and build,
            I design systems where content structure, technical foundations, and user journeys work together.
            The goal is simple: sustainable growth from organic search and better conversion from every visit.
          </p>
        </section>

        <section id="services" className="border-t border-white/10 py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">My Services</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {services.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/15 bg-white/[0.02] p-5">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="border-t border-white/10 py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">Selected Work</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Local Service SEO Revamp", "Technical cleanup + location pages + internal linking model"],
              ["WordPress Redesign & Migration", "Performance-first rebuild with cleaner UX and SEO-safe migration"],
              ["Content Cluster Rollout", "Search-intent clusters with conversion-focused page templates"],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-white/15 p-5">
                <h3 className="text-base font-medium">{title}</h3>
                <p className="mt-2 text-sm text-white/70">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="border-t border-white/10 py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">Process</h2>
          <div className="mt-6 grid gap-3">
            {process.map((step, idx) => (
              <div key={step} className="flex items-center gap-4 rounded-xl border border-white/15 px-4 py-3">
                <span className="w-7 text-sm text-white/50">0{idx + 1}</span>
                <p className="text-sm text-white/85">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="border-t border-white/10 py-14">
          <h2 className="text-2xl font-semibold md:text-3xl">Client Reviews</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <blockquote key={review.who} className="rounded-2xl border border-white/15 bg-white/[0.02] p-5">
                <p className="text-sm text-white/80">“{review.quote}”</p>
                <footer className="mt-4 text-xs uppercase tracking-[0.14em] text-white/50">{review.who}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="cta" className="border-t border-white/10 py-14">
          <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8 text-center md:p-10">
            <p className="text-xs uppercase tracking-[0.24em] text-white/55">Let’s Build Growth</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Need an SEO + WordPress partner who can execute fast?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 md:text-base">
              Share your website and growth target. I’ll map a practical roadmap and execution plan.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:hello@sakibahmed.com"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
              >
                Start Project
              </a>
              <a
                href="https://www.linkedin.com/in/ahmed-sakib-upp/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:bg-white/10"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-sm text-white/60">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Sakib Ahmed. All rights reserved.</p>
            <p>SEO Expert • WordPress Developer</p>
          </div>
          <div className="mt-3">
            <Link href="/tools" className="text-white/70 underline hover:text-white">
              Back to Tools Challenge
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
