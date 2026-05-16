import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Verified Carbon Projects",
  description:
    "Five independently certified carbon projects. Every tonne is permanently retired. Choose a project and fund a tonne.",
};

export default function ProjectsPage() {
  const removalProjects = projects.filter((p) => p.creditType === "removal");
  const avoidanceProjects = projects.filter((p) => p.creditType === "avoidance");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-5 leading-tight">
            Verified Carbon Projects
          </h1>
          <p className="text-[#555f55] text-lg leading-relaxed mb-4">
            Every project is independently certified. Every tonne is permanently
            retired.
          </p>
          <p className="text-[#555f55] text-sm leading-relaxed">
            We use &ldquo;fund&rdquo; deliberately. Buying a carbon credit doesn&apos;t make you
            &ldquo;carbon neutral&rdquo; — it funds real action that either removes CO₂ from
            the atmosphere or prevents emissions that would otherwise occur. Both
            matter. Both are honest. Neither is an excuse to emit more.
          </p>
        </div>

        {/* Removal projects */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: "#2d6a4f" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              Carbon Removal
            </span>
            <span className="text-[#555f55] text-xs">
              CO₂ physically sequestered from the atmosphere
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {removalProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* Avoidance projects */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: "#3d6b8f" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              Emissions Avoidance
            </span>
            <span className="text-[#555f55] text-xs">
              Emissions prevented that would otherwise have occurred
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {avoidanceProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        {/* Registry note */}
        <div
          className="mt-16 p-6 rounded-2xl"
          style={{ border: "1px solid #e0e8e0", background: "#f8f9f8" }}
        >
          <h2 className="text-[#1a1a1a] font-semibold mb-3">
            About our registries
          </h2>
          <p className="text-[#555f55] text-sm leading-relaxed mb-4">
            Every credit we sell is independently certified by an internationally
            recognised registry. Registries verify that the project is real, that
            the carbon accounting is correct, and that each credit is only sold
            once.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              {
                name: "Gold Standard",
                url: "https://www.goldstandard.org",
              },
              { name: "Verra VCS", url: "https://verra.org" },
              {
                name: "Woodland Carbon Code",
                url: "https://woodlandcarboncode.org.uk",
              },
            ].map((reg) => (
              <a
                key={reg.name}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: "#2d6a4f" }}
              >
                {reg.name} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
