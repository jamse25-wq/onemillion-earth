"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { projects } from "@/lib/projects";

// Fallback entries shown while loading or if Supabase returns nothing
const FALLBACK_ENTRIES = [
  "🌿 Sarah M. funded 5t of carbon removal via Borneo Rainforest Regeneration · UK",
  "🌍 GreenTech Solutions funded 20t of emissions avoidance via Amazon REDD+ Forest Protection · Germany",
  "🌱 James K. funded 2t of carbon removal via Scottish Peatland Restoration · Scotland",
  "🌊 Ocean Labs funded 10t of carbon removal via Seagrass Meadow Restoration · USA",
  "🌿 Priya R. funded 8t of carbon removal via Borneo Rainforest Regeneration · India",
  "🌍 Volta Energy funded 50t of emissions avoidance via Amazon REDD+ Forest Protection · France",
  "🌱 Tom & Ella funded 1t of carbon removal via Scottish Peatland Restoration · Ireland",
];

interface Purchase {
  id: string;
  buyer_name: string;
  is_anonymous: boolean;
  organisation: string | null;
  project_slug: string;
  tonnes: number;
  country: string | null;
}

function buildTickerText(purchase: Purchase): string {
  const project = projects.find((p) => p.slug === purchase.project_slug);
  const projectName = project?.name ?? purchase.project_slug;
  const creditType = project?.creditType ?? "removal";

  const creditLabel =
    creditType === "removal" ? "carbon removal" : "emissions avoidance";

  const locationSuffix = purchase.country ? ` · ${purchase.country}` : "";

  if (purchase.is_anonymous) {
    if (purchase.country) {
      return `🌱 Someone in ${purchase.country} funded ${purchase.tonnes}t via ${projectName}`;
    }
    return `🌱 Someone funded ${purchase.tonnes}t via ${projectName}`;
  }

  const displayName =
    purchase.organisation && purchase.organisation.trim()
      ? purchase.organisation.trim()
      : purchase.buyer_name;

  return `🌿 ${displayName} funded ${purchase.tonnes}t of ${creditLabel} via ${projectName}${locationSuffix}`;
}

export default function Ticker() {
  const [entries, setEntries] = useState<string[]>(FALLBACK_ENTRIES);

  async function fetchPurchases() {
    const { data, error } = await supabase
      .from("purchases")
      .select(
        "id, buyer_name, is_anonymous, organisation, project_slug, tonnes, country"
      )
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) return;

    const tickerTexts = data.map((purchase) =>
      buildTickerText(purchase as Purchase)
    );
    setEntries(tickerTexts);
  }

  useEffect(() => {
    fetchPurchases();

    const interval = setInterval(fetchPurchases, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate for seamless loop
  const loopedEntries = [...entries, ...entries];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-[#111811]/60 py-3">
      {/* Fade left */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0a0f0a] to-transparent" />
      {/* Fade right */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0a0f0a] to-transparent" />

      <div className="flex whitespace-nowrap ticker-animate">
        {loopedEntries.map((entry, i) => (
          <span
            key={i}
            className="inline-flex items-center text-[#7aab8a] text-sm px-8"
          >
            {entry}
            <span className="mx-8 text-[#3ddc84]/30">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
