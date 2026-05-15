import Link from "next/link";
import Ticker from "@/components/Ticker";
import ProjectCard from "@/components/ProjectCard";
import GlobeWrapper from "@/components/GlobeWrapper";
import { projects } from "@/lib/projects";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Ticker */}
      <Ticker />

      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center overflow-hidden">
        {/* Subtle radial glow background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(61,220,132,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3ddc84]/20 bg-[#3ddc84]/5 text-[#3ddc84] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-pulse" />
            2,847 segments claimed — 997,153 remaining
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#e8f5e9] leading-tight tracking-tight text-balance mb-6">
            Help us fund{" "}
            <span className="text-[#3ddc84]">one million tonnes</span> of
            verified carbon action — one tonne at a time.
          </h1>

          <p className="text-[#7aab8a] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            The globe is divided into one million segments. Each tonne you fund
            fills one. Every credit is independently verified and permanently
            retired.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#3ddc84] text-[#0a0f0a] font-semibold text-base hover:bg-[#3ddc84]/90 transition-colors shadow-glow"
            >
              Claim Your Segment
            </Link>
            <Link
              href="/why-carbon-credits"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 text-[#7aab8a] font-medium text-base hover:text-[#e8f5e9] hover:border-white/20 transition-colors"
            >
              How it works →
            </Link>
          </div>
        </div>
      </section>

      {/* Globe */}
      <section className="flex flex-col items-center px-4 pb-24">
        <div
          className="relative globe-glow"
          style={{ width: "min(550px, 100%)" }}
        >
          <GlobeWrapper fillPercentage={0.003} />
          {/* Globe updated daily label */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0f0a]/80 border border-[#3ddc84]/20 pointer-events-none">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]"
              style={{ boxShadow: "0 0 6px #3ddc84" }}
            />
            <span className="text-[#3ddc84] text-xs font-mono whitespace-nowrap">
              0.003% funded · Globe updated daily
            </span>
          </div>
        </div>
      </section>

      {/* Counter */}
      <section className="border-y border-white/5 bg-[#111811]/40 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="text-7xl sm:text-8xl font-bold text-[#3ddc84] tabular-nums"
            style={{ textShadow: "0 0 40px rgba(61,220,132,0.3)" }}
          >
            2,847
          </div>
          <p className="mt-3 text-[#7aab8a] text-xl font-medium">
            tonnes funded so far
          </p>
          <p className="mt-2 text-[#7aab8a]/50 text-sm">
            997,153 remaining to reach one million
          </p>
        </div>
      </section>

      {/* Projects section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e8f5e9] mb-4">
            Choose a verified project
          </h2>
          <p className="text-[#7aab8a] text-lg max-w-2xl mx-auto">
            Five projects, five continents. Every credit independently certified
            and permanently retired.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[#3ddc84] text-sm hover:opacity-80 transition-opacity"
          >
            View all projects and details →
          </Link>
        </div>
      </section>

      {/* How it works strip */}
      <section className="border-t border-white/5 bg-[#111811]/30 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#e8f5e9] mb-12">
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
                <div className="w-10 h-10 rounded-full border border-[#3ddc84]/30 flex items-center justify-center mb-5">
                  <span className="text-[#3ddc84] text-xs font-mono">
                    {step}
                  </span>
                </div>
                <h3 className="text-[#e8f5e9] font-semibold mb-2">{title}</h3>
                <p className="text-[#7aab8a] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
