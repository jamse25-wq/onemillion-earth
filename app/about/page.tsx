import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we built onemillion.earth — and how it works. One million tonnes of verified carbon action, one tonne at a time.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Mission */}
        <div className="mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] leading-tight mb-6">
            About onemillion.earth
          </h1>
          <p className="text-[#555f55] text-xl leading-relaxed mb-6">
            We built a single, honest thing: a platform where individuals and
            organisations can fund verified carbon action and watch the impact
            accumulate in real time on a globe.
          </p>
          <p className="text-[#555f55] text-xl leading-relaxed">
            Our mission is to fund one million tonnes of independently verified
            carbon removal and emissions avoidance — one tonne at a time.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-10">
            How it works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Choose a project",
                body: "Pick from five independently certified carbon projects — from Scottish peatlands to Kenyan cookstoves to Amazon rainforest. Read what each project does, who certifies it, what its co-benefits are, and the price per tonne. We're transparent about whether each project is carbon removal or emissions avoidance. No euphemisms.",
              },
              {
                step: "02",
                title: "Fund a tonne",
                body: "Select how many tonnes to fund. The price breakdown shows the carbon cost (passed directly to the registry) and our 18% platform fee, which covers verification work, operations and ongoing project monitoring. There are no hidden charges.",
              },
              {
                step: "03",
                title: "Globe updates",
                body: "Your segment lights up on the globe. The tonne is permanently retired in a public registry — Gold Standard, Verra VCS, or the Woodland Carbon Code depending on the project. You can verify it independently at any time. The globe updates daily.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-6">
                <div className="shrink-0 mt-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid #e0e8e0" }}
                  >
                    <span
                      className="text-xs font-mono"
                      style={{ color: "#2d6a4f" }}
                    >
                      {step}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[#1a1a1a] font-semibold text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-[#555f55] leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why we built this */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            Why we built this
          </h2>
          <div className="space-y-4 text-[#555f55] leading-relaxed">
            <p>
              The voluntary carbon market has a credibility problem. Greenwash
              is rampant. &ldquo;Carbon neutral&rdquo; claims are everywhere. Companies buy
              cheap, low-quality credits and use them to avoid doing anything
              meaningful.
            </p>
            <p>
              We wanted to build something different: a platform that is
              radically honest about what carbon credits are and aren&apos;t, that
              only lists high-quality certified projects, and that makes the
              mechanics completely transparent.
            </p>
            <p>
              The globe is part of that transparency. When you fund a tonne,
              you see exactly where it sits in the one million. You can watch
              progress in real time. It&apos;s not a certificate you file and forget
              — it&apos;s a living record of collective action.
            </p>
            <p>
              We don&apos;t use the word &ldquo;offset&rdquo;. We don&apos;t promise &ldquo;carbon
              neutrality&rdquo;. We say: here is a real project, here is what it
              does, here is what your money funds. That&apos;s it.
            </p>
          </div>
        </section>

        {/* Platform fee */}
        <section
          className="p-6 rounded-2xl mb-16"
          style={{ border: "1px solid #e0e8e0", background: "#f8f9f8" }}
        >
          <h2 className="text-[#1a1a1a] font-semibold mb-4">
            Our platform fee
          </h2>
          <p className="text-[#555f55] text-sm leading-relaxed mb-3">
            We charge an 18% platform fee on each transaction. This covers:
          </p>
          <ul className="space-y-2 text-[#555f55] text-sm">
            {[
              "Independent verification and due diligence on each project",
              "Platform operations, security and maintenance",
              "Registry administration and retirement tracking",
              "Ongoing project monitoring",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span style={{ color: "#2d6a4f" }} className="mt-0.5">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[#555f55] text-xs">
            The platform fee is not a carbon cost. 100% of the carbon cost goes
            directly to the registry for credit retirement.
          </p>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-full text-white font-semibold text-sm transition-colors text-center"
            style={{ background: "#2d6a4f" }}
          >
            View Projects
          </Link>
          <Link
            href="/verify"
            className="px-6 py-3 rounded-full text-[#555f55] font-medium text-sm transition-colors text-center hover:bg-[#f8f9f8]"
            style={{ border: "1px solid #e0e8e0" }}
          >
            Verify our claims
          </Link>
        </div>
      </div>
    </div>
  );
}
