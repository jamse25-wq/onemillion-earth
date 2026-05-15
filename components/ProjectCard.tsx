import Link from "next/link";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isRemoval = project.creditType === "removal";

  return (
    <div className="group relative flex flex-col bg-[#111811] border border-white/8 rounded-2xl p-6 glow-border glow-border-hover transition-all duration-300 hover:-translate-y-0.5">
      {/* Credit type badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isRemoval
              ? "bg-[#3ddc84]/10 text-[#3ddc84] border border-[#3ddc84]/20"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isRemoval ? "bg-[#3ddc84]" : "bg-blue-400"}`}
          />
          {isRemoval ? "Carbon Removal" : "Emissions Avoidance"}
        </span>
        <span className="text-[#7aab8a] text-xs">{project.registry}</span>
      </div>

      {/* Project name */}
      <h3 className="text-[#e8f5e9] font-semibold text-base leading-snug mb-1.5 group-hover:text-white transition-colors">
        {project.name}
      </h3>

      {/* Region */}
      <p className="text-[#7aab8a] text-xs mb-3">{project.region}</p>

      {/* Description */}
      <p className="text-[#7aab8a] text-sm leading-relaxed flex-1 mb-5">
        {project.description}
      </p>

      {/* Co-benefits */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.coBenefits.slice(0, 3).map((benefit) => (
          <span
            key={benefit}
            className="px-2 py-0.5 rounded-md bg-white/5 text-[#7aab8a] text-xs"
          >
            {benefit}
          </span>
        ))}
        {project.coBenefits.length > 3 && (
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#7aab8a]/60 text-xs">
            +{project.coBenefits.length - 3}
          </span>
        )}
      </div>

      {/* Price and CTA */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[#e8f5e9] font-bold text-xl">
            £{project.pricePerTonneGbp}
          </span>
          <span className="text-[#7aab8a] text-xs ml-1">/ tonne</span>
        </div>
        <Link
          href={`/project/${project.slug}`}
          className="px-4 py-2 rounded-full border border-[#3ddc84]/30 text-[#3ddc84] text-sm font-medium hover:bg-[#3ddc84] hover:text-[#0a0f0a] transition-all duration-200"
        >
          Learn more →
        </Link>
      </div>
    </div>
  );
}
