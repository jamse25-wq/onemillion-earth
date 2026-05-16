import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Verify",
  description:
    "Full transparency on every tonne funded through onemillion.earth. Registry links, project breakdowns, and our platform fee statement.",
};

export const revalidate = 3600;

interface ProjectBreakdownRow {
  name: string;
  slug: string;
  registry: string;
  registryUrl: string | null;
  tonnes: number;
  carbonCost: number;
  creditType: string;
}

async function getVerifyData() {
  const { data: purchaseRows, error } = await supabase
    .from("purchases")
    .select("project_slug, tonnes, carbon_cost_gbp");

  if (error || !purchaseRows) {
    return {
      totalTonnes: 0,
      totalCarbonCost: 0,
      projectBreakdowns: [] as ProjectBreakdownRow[],
    };
  }

  const bySlug = new Map<string, { tonnes: number; carbonCost: number }>();

  for (const row of purchaseRows) {
    const existing = bySlug.get(row.project_slug) ?? {
      tonnes: 0,
      carbonCost: 0,
    };
    bySlug.set(row.project_slug, {
      tonnes: existing.tonnes + (row.tonnes ?? 0),
      carbonCost: existing.carbonCost + (row.carbon_cost_gbp ?? 0),
    });
  }

  const projectBreakdowns: ProjectBreakdownRow[] = [];

  for (const project of projects) {
    const agg = bySlug.get(project.slug);
    if (!agg || agg.tonnes === 0) continue;

    projectBreakdowns.push({
      name: project.name,
      slug: project.slug,
      registry: project.registry,
      registryUrl: project.registryUrl,
      tonnes: agg.tonnes,
      carbonCost: agg.carbonCost,
      creditType:
        project.creditType === "removal"
          ? "Carbon Removal"
          : "Emissions Avoidance",
    });
  }

  projectBreakdowns.sort((a, b) => b.tonnes - a.tonnes);

  const totalTonnes = purchaseRows.reduce(
    (sum, r) => sum + (r.tonnes ?? 0),
    0
  );
  const totalCarbonCost = purchaseRows.reduce(
    (sum, r) => sum + (r.carbon_cost_gbp ?? 0),
    0
  );

  return { totalTonnes, totalCarbonCost, projectBreakdowns };
}

export default async function VerifyPage() {
  const { totalTonnes, totalCarbonCost, projectBreakdowns } =
    await getVerifyData();

  const PLATFORM_FEE_RATE = 0.18;
  const platformFeeCollected = Math.round(totalCarbonCost * PLATFORM_FEE_RATE);
  const totalCarbonCostRounded = Math.round(totalCarbonCost);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              border: "1px solid #e0e8e0",
              background: "#f8f9f8",
              color: "#555f55",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#2d6a4f" }}
            />
            Transparency report
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] leading-tight mb-5">
            Verify
          </h1>
          <p className="text-[#555f55] text-lg leading-relaxed max-w-2xl">
            Every tonne funded through onemillion.earth is permanently retired
            in a public registry. Here is the full breakdown. Anyone can verify
            any credit independently.
          </p>
        </div>

        {/* Top-level totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            {
              label: "Total tonnes funded",
              value: totalTonnes.toLocaleString(),
              unit: "t CO₂e",
              highlight: true,
            },
            {
              label: "Passed to registries",
              value: `£${totalCarbonCostRounded.toLocaleString()}`,
              unit: "registry cost",
              highlight: false,
            },
            {
              label: "Platform fee collected",
              value: `£${platformFeeCollected.toLocaleString()}`,
              unit: "18% of carbon cost",
              highlight: false,
            },
          ].map(({ label, value, unit, highlight }) => (
            <div
              key={label}
              className="p-6 rounded-2xl"
              style={{
                border: highlight ? "1px solid #2d6a4f" : "1px solid #e0e8e0",
                background: highlight ? "#f0f7f4" : "#f8f9f8",
              }}
            >
              <p className="text-[#555f55] text-xs mb-1">{label}</p>
              <p
                className="text-3xl font-bold tabular-nums"
                style={{ color: highlight ? "#2d6a4f" : "#1a1a1a" }}
              >
                {value}
              </p>
              <p className="text-[#555f55] text-xs mt-1">{unit}</p>
            </div>
          ))}
        </div>

        {/* Breakdown by project */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
            Breakdown by project
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #e0e8e0" }}
          >
            {projectBreakdowns.length === 0 ? (
              <div className="py-16 text-center text-[#555f55]">
                No purchases yet — be the first to fund a tonne.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #e0e8e0",
                      background: "#f8f9f8",
                    }}
                  >
                    <th className="text-left px-5 py-4 text-[#555f55] text-xs font-semibold uppercase tracking-wider">
                      Project
                    </th>
                    <th className="text-left px-4 py-4 text-[#555f55] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-right px-4 py-4 text-[#555f55] text-xs font-semibold uppercase tracking-wider">
                      Tonnes
                    </th>
                    <th className="text-right px-4 py-4 text-[#555f55] text-xs font-semibold uppercase tracking-wider">
                      Passed to Registry
                    </th>
                    <th className="text-left px-4 py-4 text-[#555f55] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                      Registry
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projectBreakdowns.map((row, i) => (
                    <tr
                      key={i}
                      className="transition-colors hover:bg-[#f8f9f8]"
                      style={{
                        borderBottom:
                          i < projectBreakdowns.length - 1
                            ? "1px solid #e0e8e0"
                            : "none",
                      }}
                    >
                      <td className="px-5 py-4">
                        <span className="text-[#1a1a1a] text-sm font-medium">
                          {row.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{
                            background:
                              row.creditType === "Carbon Removal"
                                ? "#2d6a4f"
                                : "#3d6b8f",
                          }}
                        >
                          {row.creditType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-[#1a1a1a] tabular-nums text-sm">
                          {row.tonnes.toLocaleString()}t
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className="tabular-nums text-sm font-medium"
                          style={{ color: "#2d6a4f" }}
                        >
                          £{Math.round(row.carbonCost).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        {row.registryUrl ? (
                          <a
                            href={row.registryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline transition-colors"
                            style={{ color: "#2d6a4f" }}
                          >
                            {row.registry} ↗
                          </a>
                        ) : (
                          <span className="text-[#555f55] text-sm">
                            {row.registry}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr style={{ background: "#f8f9f8" }}>
                    <td className="px-5 py-4 font-semibold text-[#1a1a1a]">
                      Total
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell" />
                    <td className="px-4 py-4 text-right font-bold text-[#1a1a1a] tabular-nums">
                      {totalTonnes.toLocaleString()}t
                    </td>
                    <td
                      className="px-4 py-4 text-right font-bold tabular-nums"
                      style={{ color: "#2d6a4f" }}
                    >
                      £{totalCarbonCostRounded.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell" />
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Platform fee statement */}
        <section
          className="mb-16 p-6 rounded-2xl"
          style={{ border: "1px solid #e0e8e0", background: "#f8f9f8" }}
        >
          <h2 className="text-[#1a1a1a] font-semibold text-lg mb-4">
            Platform fee statement
          </h2>
          <p className="text-[#555f55] text-sm leading-relaxed mb-4">
            We charge an 18% platform fee on each transaction, calculated on the
            carbon cost (the price per tonne × number of tonnes). This fee
            covers:
          </p>
          <ul className="space-y-2 text-[#555f55] text-sm mb-5">
            {[
              "Independent verification and due diligence on each listed project",
              "Platform development, security and infrastructure",
              "Registry administration and public retirement tracking",
              "Ongoing project monitoring and reporting",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span
                  className="mt-0.5 shrink-0"
                  style={{ color: "#2d6a4f" }}
                >
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-[#555f55] text-sm leading-relaxed">
            The platform fee is separate from and additional to the carbon cost.
            It is not a carbon cost. 100% of the stated carbon cost is passed to
            the registry for credit retirement. Registry batch purchases are
            reviewed weekly by the founding team.
          </p>
        </section>

        {/* Registries */}
        <section>
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">
            Registry links
          </h2>
          <p className="text-[#555f55] text-sm leading-relaxed mb-6">
            Credits can be independently verified through the following public
            registries:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: "Gold Standard",
                url: "https://www.goldstandard.org",
                description: "Kenya cookstoves, Borneo rainforest regeneration",
              },
              {
                name: "Verra VCS",
                url: "https://verra.org",
                description: "Amazon REDD+ forest protection",
              },
              {
                name: "Woodland Carbon Code",
                url: "https://woodlandcarboncode.org.uk",
                description: "Scottish peatland restoration",
              },
            ].map((reg) => (
              <a
                key={reg.name}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl transition-colors group hover:border-[#2d6a4f]"
                style={{ border: "1px solid #e0e8e0", background: "white" }}
              >
                <p
                  className="font-semibold text-sm group-hover:underline mb-1"
                  style={{ color: "#2d6a4f" }}
                >
                  {reg.name} ↗
                </p>
                <p className="text-[#555f55] text-xs">{reg.description}</p>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[#555f55] text-xs">
            Registry batch purchases are reviewed weekly by the founding team.
            Data refreshes hourly.
          </p>
        </section>
      </div>
    </div>
  );
}
