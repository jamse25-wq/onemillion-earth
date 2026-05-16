"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { projects } from "@/lib/projects";

type Tab = "today" | "week" | "alltime";

interface RawPurchase {
  buyer_name: string;
  is_anonymous: boolean;
  organisation: string | null;
  project_slug: string;
  tonnes: number;
  amount_gbp: number;
}

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  subName: string | null;
  isAnonymous: boolean;
  totalSpend: number;
  totalTonnes: number;
  topProject: string;
}

function getStartOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getStartOfWeek(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function getProjectName(slug: string): string {
  const project = projects.find((p) => p.slug === slug);
  return project?.name ?? slug;
}

// Group raw purchases into leaderboard entries.
// Anonymous rows are kept separate (each is its own entry).
// Named rows are grouped by a composite key of buyer_name + organisation.
function buildLeaderboard(purchases: RawPurchase[]): LeaderboardEntry[] {
  const namedMap = new Map<
    string,
    {
      displayName: string;
      subName: string | null;
      totalSpend: number;
      totalTonnes: number;
      projectCounts: Map<string, number>;
    }
  >();

  const anonymousEntries: LeaderboardEntry[] = [];

  for (const p of purchases) {
    if (p.is_anonymous) {
      // Each anonymous row gets its own entry (we can't group them)
      anonymousEntries.push({
        rank: 0, // assigned later
        displayName: "Anonymous",
        subName: null,
        isAnonymous: true,
        totalSpend: p.amount_gbp,
        totalTonnes: p.tonnes,
        topProject: getProjectName(p.project_slug),
      });
    } else {
      const orgName =
        p.organisation && p.organisation.trim() ? p.organisation.trim() : null;
      const displayName = orgName ?? p.buyer_name;
      const subName = orgName ? p.buyer_name : null;
      const key = `${p.buyer_name}||${p.organisation ?? ""}`;

      const existing = namedMap.get(key);
      if (existing) {
        existing.totalSpend += p.amount_gbp;
        existing.totalTonnes += p.tonnes;
        const count = existing.projectCounts.get(p.project_slug) ?? 0;
        existing.projectCounts.set(p.project_slug, count + 1);
      } else {
        const projectCounts = new Map<string, number>();
        projectCounts.set(p.project_slug, 1);
        namedMap.set(key, {
          displayName,
          subName,
          totalSpend: p.amount_gbp,
          totalTonnes: p.tonnes,
          projectCounts,
        });
      }
    }
  }

  // Build named entries
  const namedEntries: LeaderboardEntry[] = Array.from(namedMap.values()).map(
    (v) => {
      // Pick the most-used project slug
      let topSlug = "";
      let topCount = 0;
      v.projectCounts.forEach((count, slug) => {
        if (count > topCount) {
          topCount = count;
          topSlug = slug;
        }
      });

      return {
        rank: 0,
        displayName: v.displayName,
        subName: v.subName,
        isAnonymous: false,
        totalSpend: v.totalSpend,
        totalTonnes: v.totalTonnes,
        topProject: getProjectName(topSlug),
      };
    }
  );

  // Merge, sort by total spend desc, assign ranks
  const merged = [...namedEntries, ...anonymousEntries]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 25)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  return merged;
}

async function fetchLeaderboard(tab: Tab): Promise<LeaderboardEntry[]> {
  let query = supabase
    .from("purchases")
    .select(
      "buyer_name, is_anonymous, organisation, project_slug, tonnes, amount_gbp"
    )
    .order("created_at", { ascending: false });

  if (tab === "today") {
    query = query.gte("created_at", getStartOfToday());
  } else if (tab === "week") {
    query = query.gte("created_at", getStartOfWeek());
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return buildLeaderboard(data as RawPurchase[]);
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard(tab).then((entries) => {
      setData(entries);
      setLoading(false);
    });
  }, [tab]);

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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-[#3ddc84]/30 border-t-[#3ddc84] animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#7aab8a] text-base mb-2">
              No activity yet — be the first!
            </p>
            <a
              href="/projects"
              className="text-[#3ddc84] text-sm hover:opacity-80 transition-opacity"
            >
              Fund a tonne →
            </a>
          </div>
        ) : (
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
                    {entry.isAnonymous ? (
                      <span className="text-[#7aab8a]/60 italic font-medium">
                        Anonymous
                      </span>
                    ) : (
                      <div>
                        <span className="font-medium text-[#e8f5e9]">
                          {entry.displayName}
                        </span>
                        {entry.subName && (
                          <p className="text-[#7aab8a]/60 text-xs mt-0.5">
                            {entry.subName}
                          </p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-[#3ddc84] font-semibold tabular-nums">
                      £{entry.totalSpend.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-[#e8f5e9] tabular-nums">
                      {entry.totalTonnes.toLocaleString()}t
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
        )}
      </div>

      {/* Note */}
      <p className="mt-6 text-[#7aab8a]/50 text-xs text-center">
        Anonymous entries have requested privacy. Named entries have consented to
        appear publicly.
      </p>
    </div>
  );
}
