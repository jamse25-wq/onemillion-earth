import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Carbon Credits",
  description:
    "An honest guide to what carbon credits are, what they do, and what they can't claim. No greenwash — just clear thinking.",
};

export default function WhyCarbonCreditsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#e8f5e9] leading-tight mb-6">
          Why carbon credits?
        </h1>
        <p className="text-[#7aab8a] text-xl leading-relaxed">
          An honest answer. No greenwash. No corporate euphemism. Just a clear
          explanation of what carbon credits are, what they do — and what they
          can't.
        </p>
      </div>

      {/* Main content */}
      <div className="space-y-12 text-[#7aab8a] text-base leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-[#e8f5e9] mb-4">
            What is a carbon credit?
          </h2>
          <p className="mb-4">
            A carbon credit represents one tonne of CO₂ that has either been
            removed from the atmosphere, or prevented from entering it. When you
            buy and retire a credit, that tonne can never be sold again.
          </p>
          <p>
            The key word is "verified". Anyone can claim to have planted a tree.
            A carbon credit means an independent registry has checked the
            methodology, measured the actual impact, and certified the result.
            It's a claim backed by evidence, not a promise backed by marketing.
          </p>
        </section>

        {/* Criteria: Additional */}
        <section className="p-6 rounded-2xl border border-[#3ddc84]/15 bg-[#3ddc84]/3">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-[#3ddc84]/30 flex items-center justify-center shrink-0 mt-0.5">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#3ddc84]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[#e8f5e9] font-semibold text-lg mb-2">
                Criteria 1: Additional
              </h3>
              <p>
                The carbon impact must be additional — meaning it wouldn't have
                happened without the credit revenue. A forest that would have
                been protected anyway doesn't count. The project has to prove
                that funding was the deciding factor.
              </p>
              <p className="mt-3 text-[#7aab8a]/70 text-sm">
                This is the most scrutinised criterion, and the reason we only
                work with certified registries.
              </p>
            </div>
          </div>
        </section>

        {/* Criteria: Co-benefits */}
        <section className="p-6 rounded-2xl border border-[#3ddc84]/15 bg-[#3ddc84]/3">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-[#3ddc84]/30 flex items-center justify-center shrink-0 mt-0.5">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#3ddc84]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[#e8f5e9] font-semibold text-lg mb-2">
                Criteria 2: Co-benefits
              </h3>
              <p>
                The best projects don't just sequester carbon — they also
                protect biodiversity, improve community livelihoods, clean water
                sources, or restore habitat. We select projects that deliver
                these co-benefits alongside the core climate impact.
              </p>
              <p className="mt-3 text-[#7aab8a]/70 text-sm">
                A peatland restoration that also creates rare species habitat and
                prevents downstream flooding is a better project than one that
                only sequesters carbon.
              </p>
            </div>
          </div>
        </section>

        {/* Criteria: Certified */}
        <section className="p-6 rounded-2xl border border-[#3ddc84]/15 bg-[#3ddc84]/3">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full border border-[#3ddc84]/30 flex items-center justify-center shrink-0 mt-0.5">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-[#3ddc84]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.723 3.065 3.745 3.745 0 01-3.065.723 3.745 3.745 0 01-3.068 1.593 3.745 3.745 0 01-3.068-1.593 3.745 3.745 0 01-3.065-.723 3.745 3.745 0 01-.723-3.065A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.723-3.065 3.745 3.745 0 013.065-.723A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.065.723 3.745 3.745 0 01.723 3.065A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-[#e8f5e9] font-semibold text-lg mb-2">
                Criteria 3: Certified
              </h3>
              <p>
                Every project we list is certified by an internationally
                recognised standard. We use Gold Standard, Verra VCS, and the
                Woodland Carbon Code. These organisations set the methodology,
                verify the measurements, and maintain the public registries
                where credits are retired.
              </p>
            </div>
          </div>
        </section>

        {/* Removal vs avoidance */}
        <section>
          <h2 className="text-2xl font-bold text-[#e8f5e9] mb-4">
            Removal vs. avoidance — what's the difference?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
            <div className="p-5 rounded-xl border border-[#3ddc84]/15 bg-[#111811]">
              <p className="text-[#3ddc84] font-semibold mb-2">
                Carbon removal
              </p>
              <p className="text-sm">
                CO₂ is physically taken out of the atmosphere and stored — in
                trees, soil, peat, or ocean sediment. Projects: Borneo
                rainforest, Scottish peatlands, Cornish seagrass.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-blue-500/15 bg-[#111811]">
              <p className="text-blue-400 font-semibold mb-2">
                Emissions avoidance
              </p>
              <p className="text-sm">
                Emissions that would otherwise have occurred are prevented. Not
                sequestration, but still real impact. Projects: Kenya
                cookstoves, Amazon REDD+.
              </p>
            </div>
          </div>
          <p>
            Both matter. We're transparent about which type each project is. We
            never mix them up or pretend avoidance is the same as removal.
          </p>
        </section>

        {/* What we don't claim */}
        <section className="p-6 rounded-2xl border border-white/8 bg-[#111811]">
          <h2 className="text-xl font-bold text-[#e8f5e9] mb-5">
            What we don't claim
          </h2>
          <ul className="space-y-4">
            {[
              {
                claim: 'We never say “carbon neutral”.',
                detail:
                  'Buying carbon credits doesn’t neutralise your emissions. The word “neutral” implies a balance that can’t be scientifically demonstrated.',
              },
              {
                claim: 'We never say “net zero”.',
                detail:
                  'Net zero is a systems-level target for entire economies and large organisations over long timeframes. It’s not something a single purchase achieves.',
              },
              {
                claim: 'We never say “offset”.',
                detail:
                  'The word “offset” implies one thing cancels out another. It doesn’t — a tonne sequestered in a peatland doesn’t undo a tonne emitted from a car. Both exist.',
              },
              {
                claim: "We never encourage more emissions.",
                detail:
                  "Funding climate action is good. Using it as justification to emit more is bad. We are clear about this distinction.",
              },
            ].map(({ claim, detail }) => (
              <li key={claim} className="flex items-start gap-3">
                <span className="text-[#3ddc84] mt-0.5 shrink-0">✗</span>
                <div>
                  <p className="text-[#e8f5e9] font-medium">{claim}</p>
                  <p className="text-[#7aab8a] text-sm mt-0.5">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Further reading */}
        <section>
          <h2 className="text-2xl font-bold text-[#e8f5e9] mb-4">
            Further reading
          </h2>
          <ul className="space-y-3">
            {[
              {
                label: "Gold Standard — how credits are certified",
                url: "https://www.goldstandard.org/our-work/our-standard",
              },
              {
                label: "Verra — Verified Carbon Standard methodology",
                url: "https://verra.org/programs/verified-carbon-standard/",
              },
              {
                label: "Woodland Carbon Code — UK peatland and forestry credits",
                url: "https://woodlandcarboncode.org.uk",
              },
              {
                label:
                  "Oxford Principles for Net Zero Aligned Carbon Offsetting",
                url: "https://www.smithschool.ox.ac.uk/research/sustainable-finance/publications/oxford-principles-for-net-zero-aligned-carbon-offsetting.pdf",
              },
            ].map(({ label, url }) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3ddc84] hover:underline"
                >
                  {label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className="pt-4 border-t border-white/8">
          <p className="mb-5">
            If you're satisfied that these projects are real and credible, the
            next step is to fund one.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3ddc84] text-[#0a0f0a] font-semibold text-sm hover:bg-[#3ddc84]/90 transition-colors"
          >
            View verified projects →
          </Link>
        </div>
      </div>
    </div>
  );
}
