import Link from "next/link";
import { Project } from "@/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isRemoval = project.creditType === "removal";

  return (
    <div
      className="group flex flex-col bg-white rounded-[12px] p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        border: "1px solid #e0e8e0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Credit type badge */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
            isRemoval ? "bg-[#2d6a4f]" : "bg-[#3d6b8f]"
          }`}
        >
          {isRemoval ? "Carbon Removal" : "Emissions Avoidance"}
        </span>
        <span className="text-[#555f55] text-xs">{project.registry}</span>
      </div>

      {/* Project name */}
      <h3 className="text-[#1a1a1a] font-semibold text-base leading-snug mb-1.5 group-hover:text-[#2d6a4f] transition-colors">
        {project.name}
      </h3>

      {/* Region */}
      <p className="text-[#555f55] text-xs mb-3">{project.region}</p>

      {/* Description */}
      <p className="text-[#555f55] text-sm leading-relaxed flex-1 mb-5">
        {project.description}
      </p>

      {/* Co-benefits */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.coBenefits.slice(0, 3).map((benefit) => (
          <span
            key={benefit}
            className="px-2 py-0.5 rounded-md bg-[#f8f9f8] border border-[#e0e8e0] text-[#555f55] text-xs"
          >
            {benefit}
          </span>
        ))}
        {project.coBenefits.length > 3 && (
          <span className="px-2 py-0.5 rounded-md bg-[#f8f9f8] border border-[#e0e8e0] text-[#555f55]/60 text-xs">
            +{project.coBenefits.length - 3}
          </span>
        )}
      </div>

      {/* Price and CTA */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[#1a1a1a] font-bold text-xl">
            £{project.pricePerTonneGbp}
          </span>
          <span className="text-[#555f55] text-xs ml-1">/ tonne</span>
        </div>
        <Link
          href={`/project/${project.slug}`}
          className="px-4 py-2 rounded-full text-[#2d6a4f] text-sm font-medium hover:bg-[#2d6a4f] hover:text-white transition-all duration-200"
          style={{ border: "1px solid #2d6a4f" }}
        >
          Learn more →
        </Link>
      </div>
    </div>
  );
}
