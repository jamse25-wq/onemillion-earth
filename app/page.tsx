import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import GlobeWrapper from "@/components/GlobeWrapper";
import { projects } from "@/lib/projects";
import { supabase } from "@/lib/supabase";

async function getGlobeSnapshot() {
  const { data, error } = await supabase
    .from("globe_snapshot")
    .select("total_tonnes, total_purchases, fill_percentage")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { total_tonnes: 0, total_purchases: 0, fill_percentage: 0 };
  }

  return data;
}

export default async function HomePage() {
  const snapshot = await getGlobeSnapshot();

  const totalTonnes = snapshot.total_tonnes ?? 0;
  const fillPercentage = snapshot.fill_percentage ?? 0;

  const remaining = Math.max(0, 1_000_000 - totalTonnes);

  return (
    <div className="flex flex-col bg-white">
      {/* ── Section 1: Globe hero ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center overflow-hidden bg-white pt-20">
        {/* Globe */}
        <div className="relative w-full flex justify-center px-4" style={{ maxWidth: 620, margin: "0 auto" }}>
          <GlobeWrapper fillPercentage={fillPercentage} />
          {/* Globe updated daily label */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="text-[#555f55] text-xs">Globe updated daily</span>
          </div>
        </div>

        {/* Headline + CTA below globe */}
        <div className="relative max-w-3xl mx-auto px-6 text-center mt-10 mb-20">
          {/* Counter pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              border: "1px solid #e0e8e0",
              background: "#f8f9f8",
              color: "#555f55",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#2d6a4f" }}
            />
            {totalTonnes.toLocaleString()} tonnes funded —{" "}
            {remaining.toLocaleString()} remaining
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight tracking-tight text-balance mb-5">
            Help us fund{" "}
            <span style={{ color: "#2d6a4f" }}>one million tonnes</span> of
            verified carbon action.
          </h1>

          <p className="text-[#555f55] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The globe is divided into one million segments. Each tonne you fund
            fills one. Every credit is independently verified and permanently
            retired.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white font-semibold text-base transition-colors"
              style={{
                background: "#2d6a4f",
                boxShadow: "0 2px 12px rgba(45,106,79,0.25)",
              }}
            >
              Claim Your Segment
            </Link>
            <Link
              href="/why-carbon-credits"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-base transition-colors text-[#2d6a4f] hover:bg-[#f8f9f8]"
              style={{ border: "1px solid #e0e8e0" }}
            >
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: Why this is different ──────────────────────────── */}
      <section style={{ background: "#f8f9f8", borderTop: "1px solid #e0e8e0" }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-10 text-center">
            Built for people who understand the difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* For organisations */}
            <div
              className="flex flex-col p-8 rounded-[12px] bg-white"
              style={{
                border: "1px solid #e0e8e0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white mb-5 self-start"
                style={{ background: "#2d6a4f" }}
              >
                For organisations
              </span>
              <h3 className="text-[#1a1a1a] font-bold text-lg mb-4 leading-snug">
                Verifiable climate finance, not greenwash
              </h3>
              <p className="text-[#555f55] text-sm leading-relaxed flex-1 mb-6">
                Carbon credits are increasingly scrutinised. The companies that
                will benefit most are those that fund verified projects
                transparently — not those that quietly claim neutrality.
                onemillion.earth only lists projects that are additional,
                certified, and honest about what they do and don&apos;t achieve.
                Your company&apos;s name on this platform signals that you
                understand the difference.
              </p>
              <Link
                href="/projects"
                className="text-sm font-medium transition-colors"
                style={{ color: "#2d6a4f" }}
              >
                Browse projects →
              </Link>
            </div>

            {/* For individuals */}
            <div
              className="flex flex-col p-8 rounded-[12px] bg-white"
              style={{
                border: "1px solid #e0e8e0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white mb-5 self-start"
                style={{ background: "#3d6b8f" }}
              >
                For individuals
              </span>
              <h3 className="text-[#1a1a1a] font-bold text-lg mb-4 leading-snug">
                A movement, not a transaction
              </h3>
              <p className="text-[#555f55] text-sm leading-relaxed flex-1 mb-6">
                Every tonne you fund is permanently retired in a public registry.
                Your name joins a growing list of people who chose to act — not
                because it cancels anything out, but because verified climate
                finance matters and you want to be part of it.
              </p>
              <Link
                href="/leaderboard"
                className="text-sm font-medium transition-colors"
                style={{ color: "#3d6b8f" }}
              >
                See who&apos;s joined →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Projects ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
              Verified projects
            </h2>
            <p className="text-[#555f55] text-lg max-w-2xl">
              Five projects. Every credit independently certified and permanently
              retired.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "#2d6a4f" }}
            >
              View all projects and details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: How it works ───────────────────────────────────── */}
      <section
        className="py-20"
        style={{ background: "#f8f9f8", borderTop: "1px solid #e0e8e0" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Choose a project",
                body: "Pick from five independently verified carbon projects. Read what each one does, who certifies it, and its co-benefits.",
              },
              {
                step: "02",
                title: "Fund a tonne",
                body: "Select how many tonnes to fund. Our platform fee covers verification, operations and ongoing monitoring.",
              },
              {
                step: "03",
                title: "Globe updates",
                body: "Your segment lights up on the globe. The credit is permanently retired in a public registry — you can verify it any time.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-5"
                  style={{ border: "1px solid #e0e8e0", background: "white" }}
                >
                  <span className="text-[#2d6a4f] text-xs font-mono">
                    {step}
                  </span>
                </div>
                <h3 className="text-[#1a1a1a] font-semibold mb-2">{title}</h3>
                <p className="text-[#555f55] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
