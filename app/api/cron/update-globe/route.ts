/**
 * Daily cron job — updates the globe_snapshot table with fresh totals.
 *
 * Called by Vercel Cron at 06:00 UTC every day (see vercel.json).
 *
 * IMPORTANT — environment variables required in Vercel:
 *   CRON_SECRET            — a secret token; must match the Authorization header
 *                            sent by Vercel Cron (set in vercel.json or added manually)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Add these to your Vercel project: Project → Settings → Environment Variables
 * CRON_SECRET value: onemillion_cron_secret_2024
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Allow this route to run longer than the default 10-second edge limit
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Supabase client ───────────────────────────────────────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // ── 1. Aggregate totals ─────────────────────────────────────────────────
    const { data: totals, error: totalsError } = await supabase
      .from("purchases")
      .select("tonnes, id");

    if (totalsError) throw totalsError;

    const totalTonnes = (totals ?? []).reduce(
      (sum, row) => sum + (row.tonnes ?? 0),
      0
    );
    const totalPurchases = (totals ?? []).length;
    const fillPercentage = (totalTonnes / 1_000_000) * 100;

    // ── 2. Recent markers (last 30) ─────────────────────────────────────────
    const { data: recentRows, error: recentError } = await supabase
      .from("purchases")
      .select(
        "buyer_name, is_anonymous, tonnes, project_slug, lat, lng"
      )
      .order("created_at", { ascending: false })
      .limit(30);

    if (recentError) throw recentError;

    const recentMarkers = (recentRows ?? []).map((row) => ({
      lat: row.lat,
      lng: row.lng,
      name: row.is_anonymous ? "Anonymous" : row.buyer_name,
      tonnes: row.tonnes,
      project: row.project_slug,
    }));

    // ── 3. Upsert globe_snapshot row id=1 ──────────────────────────────────
    const { error: upsertError } = await supabase
      .from("globe_snapshot")
      .upsert(
        {
          id: 1,
          updated_at: new Date().toISOString(),
          total_tonnes: totalTonnes,
          total_purchases: totalPurchases,
          fill_percentage: fillPercentage,
          recent_markers: recentMarkers,
        },
        { onConflict: "id" }
      );

    if (upsertError) throw upsertError;

    return NextResponse.json({
      ok: true,
      totalTonnes,
      totalPurchases,
      fillPercentage,
      markersUpdated: recentMarkers.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron/update-globe] error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}
