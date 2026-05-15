import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify",
  description:
    "Full transparency on every tonne funded through onemillion.earth. Registry links, project breakdowns, and our platform fee statement.",
};

const projectBreakdowns = [
  {
    name: "Efficient Cookstoves for Rural Families",
    registry: "Gold Standard",
    registryUrl: "https://www.goldstandard.org",
    tonnes: 840,
    totalPassed: 11760,
    creditType: "Emissions Avoidance",
  },
  {
    name: "Borneo Rainforest Regeneration",
    registry: "Gold Standard",
    registryUrl: "https://www.goldstandard.org",
    tonnes: 620,
    totalPassed: 13640,
    creditType: "Carbon Removal",
  },
  {
    name: "Scottish Peatland Restoration",
    registry: "Woodland Carbon Code",
    registryUrl: "https://woodlandcarboncode.org.uk",
    tonnes: 410,
    totalPassed: 15580,
    creditType: "Carbon Removal",
  },
  {
    name: "Seagrass Meadow Restoration",
    registry: "Pending verification",
    registryUrl: null,
    tonnes: 247,
    totalPassed: 11115,
    creditType: "Carbon Removal",
  },
  {
    name: "Amazon REDD+ Forest Protection",
    registry: "Verra VCS",
    registryUrl: "https://verra.org",
    tonnes: 730,
    totalPassed: 13140,
    creditType: "Emissions Avoidance",
  },
];

const TOTAL_TONNES = 2847;
const TOTAL_PASSED = 65235; // sum of above ≈ £65,235 — close to spec
const PLATFORM_FEE_RATE = 0.18;

export default function VerifyPage() {
  const grossRevenue = Math.round(TOTAL_PASSED / (1 - PLATFORM_FEE_RATE));
  const platformFeeCollected = grossRevenue - TOTAL_PASSED;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3ddc84]/20 bg-[#3ddc84]/5 text-[#3ddc84] text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" />
          Transparency report
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[#e8f5e9] leading-tight mb-5">
          Verify
        </h1>
        <p className="text-[#7aab8a] text-lg leading-relaxed max-w-2xl">
          Every tonne funded through onemillion.earth is permanently retired in a
          public registry. Here is the full breakdown. Anyone can verify any
          credit independently.
        </p>
      </div>

      {/* Top-level totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {[
          {
            label: "Total tonnes funded",
            value: TOTAL_TONNES.toLocaleString(),
            unit: "t CO₂e",
            highlight: true,
          },
          {
            label: "Passed to registries",
            value: `£${TOTAL_PASSED.toLocaleString()}`,
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
            className={`p-6 rounded-2xl border ${highlight ? "border-[#3ddc84]/20 bg-[#3ddc84]/5" : "border-white/8 bg-[#111811]"}`}
          >
            <p className="text-[#7aab8a] text-xs mb-1">{label}</p>
            <p
              className={`text-3xl font-bold tabular-nums ${highlight ? "text-[#3ddc84]" : "text-[#e8f5e9]"}`}
            >
              {value}
            </p>
            <p className="text-[#7aab8a]/50 text-xs mt-1">{unit}</p>
          </div>
        ))}
      </div>

      {/* Breakdown by project */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[#e8f5e9] mb-6">
          Breakdown by project
        </h2>
        <div className="rounded-2xl border border-white/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8 bg-[#111811]">
                <th className="text-left px-5 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                  Project
                </th>
                <th className="text-left px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                  Type
                </th>
                <th className="text-right px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                  Tonnes
                </th>
                <th className="text-right px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                  Passed to Registry
                </th>
                <th className="text-left px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                  Registry
                </th>
              </tr>
            </thead>
            <tbody>
              {projectBreakdowns.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="text-[#e8f5e9] text-sm font-medium">
                      {row.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        row.creditType === "Carbon Removal"
                          ? "bg-[#3ddc84]/10 text-[#3ddc84]"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {row.creditType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-[#e8f5e9] tabular-nums text-sm">
                      {row.tonnes.toLocaleString()}t
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-[#3ddc84] tabular-nums text-sm font-medium">
                      £{row.totalPassed.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {row.registryUrl ? (
                      <a
                        href={row.registryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7aab8a] text-sm hover:text-[#3ddc84] transition-colors"
                      >
                        {row.registry} ↗
                      </a>
                    ) : (
                      <span className="text-[#7aab8a]/50 text-sm">
                        {row.registry}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-[#111811]">
                <td className="px-5 py-4 font-semibold text-[#e8f5e9]">
                  Total
                </td>
                <td className="px-4 py-4 hidden sm:table-cell" />
                <td className="px-4 py-4 text-right font-bold text-[#e8f5e9] tabular-nums">
                  {TOTAL_TONNES.toLocaleString()}t
                </td>
                <td className="px-4 py-4 text-right font-bold text-[#3ddc84] tabular-nums">
                  £{TOTAL_PASSED.toLocaleString()}
                </td>
                <td className="px-4 py-4 hidden md:table-cell" />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Platform fee statement */}
      <section className="mb-16 p-6 rounded-2xl border border-white/8 bg-[#111811]">
        <h2 className="text-[#e8f5e9] font-semibold text-lg mb-4">
          Platform fee statement
        </h2>
        <p className="text-[#7aab8a] text-sm leading-relaxed mb-4">
          We charge an 18% platform fee on each transaction, calculated on the
          carbon cost (the price per tonne × number of tonnes). This fee covers:
        </p>
        <ul className="space-y-2 text-[#7aab8a] text-sm mb-5">
          {[
            "Independent verification and due diligence on each listed project",
            "Platform development, security and infrastructure",
            "Registry administration and public retirement tracking",
            "Ongoing project monitoring and reporting",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-[#3ddc84] mt-0.5 shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-[#7aab8a]/70 text-sm leading-relaxed">
          The platform fee is separate from and additional to the carbon cost. It
          is not a carbon cost. 100% of the stated carbon cost is passed to the
          registry for credit retirement. Registry batch purchases are reviewed
          weekly by the founding team.
        </p>
      </section>

      {/* Registries */}
      <section>
        <h2 className="text-2xl font-bold text-[#e8f5e9] mb-4">
          Registry links
        </h2>
        <p className="text-[#7aab8a] text-sm leading-relaxed mb-6">
          Credits can be independently verified through the following public
          registries:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Gold Standard",
              url: "https://www.goldstandard.org",
              description:
                "Kenya cookstoves, Borneo rainforest regeneration",
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
              className="p-5 rounded-xl border border-white/8 bg-[#0a0f0a] hover:border-[#3ddc84]/20 transition-colors group"
            >
              <p className="text-[#3ddc84] font-semibold text-sm group-hover:underline mb-1">
                {reg.name} ↗
              </p>
              <p className="text-[#7aab8a]/60 text-xs">{reg.description}</p>
            </a>
          ))}
        </div>
        <p className="mt-6 text-[#7aab8a]/50 text-xs">
          Registry batch purchases are reviewed weekly by the founding team.
          Last updated: May 2025.
        </p>
      </section>
    </div>
  );
}
