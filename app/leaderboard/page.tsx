"use client";

import { useState } from "react";

const leaderboardData = {
  today: [
    {
      rank: 1,
      name: "GreenTech Solutions",
      spend: 2340,
      tonnes: 78,
      topProject: "Amazon REDD+ Forest Protection",
    },
    {
      rank: 2,
      name: "Sarah M.",
      spend: 1125,
      tonnes: 25,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 3,
      name: "Anonymous",
      spend: 900,
      tonnes: 50,
      topProject: "Efficient Cookstoves for Rural Families",
    },
    {
      rank: 4,
      name: "James K.",
      spend: 760,
      tonnes: 20,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 5,
      name: "Volta Energy",
      spend: 630,
      tonnes: 35,
      topProject: "Amazon REDD+ Forest Protection",
    },
    {
      rank: 6,
      name: "Anonymous",
      spend: 540,
      tonnes: 12,
      topProject: "Seagrass Meadow Restoration",
    },
    {
      rank: 7,
      name: "Priya R.",
      spend: 352,
      tonnes: 16,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 8,
      name: "Tom & Ella",
      spend: 190,
      tonnes: 5,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 9,
      name: "Anonymous",
      spend: 126,
      tonnes: 9,
      topProject: "Efficient Cookstoves for Rural Families",
    },
    {
      rank: 10,
      name: "Ocean Labs",
      spend: 90,
      tonnes: 2,
      topProject: "Seagrass Meadow Restoration",
    },
  ],
  week: [
    {
      rank: 1,
      name: "Volta Energy",
      spend: 18400,
      tonnes: 1022,
      topProject: "Amazon REDD+ Forest Protection",
    },
    {
      rank: 2,
      name: "GreenTech Solutions",
      spend: 12200,
      tonnes: 408,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 3,
      name: "Anonymous",
      spend: 9000,
      tonnes: 500,
      topProject: "Efficient Cookstoves for Rural Families",
    },
    {
      rank: 4,
      name: "Northlight Capital",
      spend: 7600,
      tonnes: 200,
      topProject: "Seagrass Meadow Restoration",
    },
    {
      rank: 5,
      name: "Sarah M.",
      spend: 5500,
      tonnes: 122,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 6,
      name: "James K.",
      spend: 3800,
      tonnes: 100,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 7,
      name: "Anonymous",
      spend: 2700,
      tonnes: 60,
      topProject: "Seagrass Meadow Restoration",
    },
    {
      rank: 8,
      name: "Priya R.",
      spend: 1760,
      tonnes: 80,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 9,
      name: "Ocean Labs",
      spend: 1350,
      tonnes: 30,
      topProject: "Seagrass Meadow Restoration",
    },
    {
      rank: 10,
      name: "Tom & Ella",
      spend: 950,
      tonnes: 25,
      topProject: "Scottish Peatland Restoration",
    },
  ],
  alltime: [
    {
      rank: 1,
      name: "Northlight Capital",
      spend: 84500,
      tonnes: 4694,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 2,
      name: "Volta Energy",
      spend: 72000,
      tonnes: 4000,
      topProject: "Amazon REDD+ Forest Protection",
    },
    {
      rank: 3,
      name: "GreenTech Solutions",
      spend: 48200,
      tonnes: 1608,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 4,
      name: "Anonymous",
      spend: 36000,
      tonnes: 2000,
      topProject: "Efficient Cookstoves for Rural Families",
    },
    {
      rank: 5,
      name: "Ocean Labs",
      spend: 27000,
      tonnes: 600,
      topProject: "Seagrass Meadow Restoration",
    },
    {
      rank: 6,
      name: "Sarah M.",
      spend: 19800,
      tonnes: 440,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 7,
      name: "Anonymous",
      spend: 14000,
      tonnes: 778,
      topProject: "Amazon REDD+ Forest Protection",
    },
    {
      rank: 8,
      name: "James K.",
      spend: 10640,
      tonnes: 280,
      topProject: "Scottish Peatland Restoration",
    },
    {
      rank: 9,
      name: "Priya R.",
      spend: 7040,
      tonnes: 320,
      topProject: "Borneo Rainforest Regeneration",
    },
    {
      rank: 10,
      name: "Tom & Ella",
      spend: 3800,
      tonnes: 100,
      topProject: "Scottish Peatland Restoration",
    },
  ],
};

type Tab = "today" | "week" | "alltime";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("today");
  const data = leaderboardData[tab];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#e8f5e9] mb-4">
          Leaderboard
        </h1>
        <p className="text-[#7aab8a] text-lg">
          Individuals and organisations making a measurable difference.
        </p>
        <p className="text-[#7aab8a]/50 text-sm mt-1">
          Leaderboard refreshes hourly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#111811] border border-white/8 rounded-xl w-fit mb-8">
        {[
          { key: "today" as Tab, label: "Today" },
          { key: "week" as Tab, label: "This Week" },
          { key: "alltime" as Tab, label: "All Time" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-[#3ddc84] text-[#0a0f0a]"
                : "text-[#7aab8a] hover:text-[#e8f5e9]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8 bg-[#111811]">
              <th className="text-left px-5 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider w-12">
                #
              </th>
              <th className="text-left px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                Name / Org
              </th>
              <th className="text-right px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                Total Spend
              </th>
              <th className="text-right px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider">
                Tonnes
              </th>
              <th className="text-left px-4 py-4 text-[#7aab8a] text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
                Top Project
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <tr
                key={i}
                className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/2 ${
                  entry.rank <= 3 ? "bg-[#111811]" : "bg-[#0a0f0a]"
                }`}
              >
                <td className="px-5 py-4">
                  {entry.rank <= 3 ? (
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-yellow-400/10 text-yellow-400"
                          : entry.rank === 2
                            ? "bg-slate-400/10 text-slate-400"
                            : "bg-amber-700/10 text-amber-600"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="text-[#7aab8a]/50 text-sm">
                      {entry.rank}
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`font-medium ${entry.name === "Anonymous" ? "text-[#7aab8a]/60 italic" : "text-[#e8f5e9]"}`}
                  >
                    {entry.name}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#3ddc84] font-semibold tabular-nums">
                    £{entry.spend.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-[#e8f5e9] tabular-nums">
                    {entry.tonnes.toLocaleString()}t
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-[#7aab8a] text-sm">
                    {entry.topProject}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="mt-6 text-[#7aab8a]/50 text-xs text-center">
        Anonymous entries have requested privacy. Named entries have consented to
        appear publicly.
      </p>
    </div>
  );
}
