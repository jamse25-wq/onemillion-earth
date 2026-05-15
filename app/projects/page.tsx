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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#e8f5e9] mb-5 leading-tight">
          Verified Carbon Projects
        </h1>
        <p className="text-[#7aab8a] text-lg leading-relaxed mb-4">
          Every project is independently certified. Every tonne is permanently
          retired.
        </p>
        <p className="text-[#7aab8a]/80 text-sm leading-relaxed">
          We use "fund" deliberately. Buying a carbon credit doesn't make you
          "carbon neutral" — it funds real action that either removes CO₂ from
          the atmosphere or prevents emissions that would otherwise occur. Both
          matter. Both are honest. Neither is an excuse to emit more.
        </p>
      </div>

      {/* Removal projects */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3ddc84]/10 text-[#3ddc84] border border-[#3ddc84]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" />
            Carbon Removal
          </span>
          <span className="text-[#7aab8a]/50 text-xs">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Emissions Avoidance
          </span>
          <span className="text-[#7aab8a]/50 text-xs">
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
      <div className="mt-16 p-6 rounded-2xl border border-white/8 bg-[#111811]">
        <h2 className="text-[#e8f5e9] font-semibold mb-3">
          About our registries
        </h2>
        <p className="text-[#7aab8a] text-sm leading-relaxed mb-4">
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
              className="text-[#3ddc84] text-sm hover:underline"
            >
              {reg.name} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
