import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/lib/projects";
import PriceCalculator from "./PriceCalculator";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const isRemoval = project.creditType === "removal";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#7aab8a]/60 mb-10">
        <Link href="/projects" className="hover:text-[#7aab8a] transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-[#7aab8a]">{project.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Credit type badge */}
          <div className="flex items-center gap-3 mb-5">
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
            {project.registryUrl ? (
              <a
                href={project.registryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7aab8a] text-xs hover:text-[#3ddc84] transition-colors"
              >
                {project.registry} ↗
              </a>
            ) : (
              <span className="text-[#7aab8a] text-xs">{project.registry}</span>
            )}
          </div>

          {/* Project name */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f5e9] leading-tight mb-2">
            {project.name}
          </h1>
          <p className="text-[#7aab8a] text-sm mb-8">{project.region}</p>

          {/* Long description */}
          <div className="prose prose-invert max-w-none mb-10">
            <p className="text-[#7aab8a] text-base leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Co-benefits */}
          <div className="mb-10">
            <h2 className="text-[#e8f5e9] font-semibold mb-4">Co-benefits</h2>
            <div className="flex flex-wrap gap-2">
              {project.coBenefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1.5 rounded-lg bg-[#111811] border border-white/8 text-[#7aab8a] text-sm"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* What this credit represents */}
          <div className="p-5 rounded-2xl border border-white/8 bg-[#111811]">
            <h2 className="text-[#e8f5e9] font-semibold mb-3">
              What this credit represents
            </h2>
            <p className="text-[#7aab8a] text-sm leading-relaxed">
              {isRemoval
                ? "Each tonne you fund represents one tonne of CO₂ physically sequestered from the atmosphere and permanently stored. The sequestration is independently measured, verified by the registry, and the credit is permanently retired — it can never be resold."
                : "Each tonne you fund prevents one tonne of CO₂ from entering the atmosphere that would otherwise have done so. The emissions avoidance is independently verified by the registry, and the credit is permanently retired — it can never be resold."}
            </p>
            <p className="mt-3 text-[#7aab8a]/60 text-xs">
              Funding a carbon credit does not make any activity "carbon neutral"
              or make you "net zero". It funds real climate action.
            </p>
          </div>
        </div>

        {/* Price calculator sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PriceCalculator project={project} />

            {/* Project quick stats */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#111811] border border-white/8">
                <p className="text-[#7aab8a]/60 text-xs mb-1">Price per tonne</p>
                <p className="text-[#e8f5e9] font-bold">
                  £{project.pricePerTonneGbp}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111811] border border-white/8">
                <p className="text-[#7aab8a]/60 text-xs mb-1">Credit type</p>
                <p className="text-[#e8f5e9] font-bold text-sm">
                  {isRemoval ? "Removal" : "Avoidance"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#111811] border border-white/8 col-span-2">
                <p className="text-[#7aab8a]/60 text-xs mb-1">Registry</p>
                <p className="text-[#e8f5e9] font-bold text-sm">
                  {project.registry}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
