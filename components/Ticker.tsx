const tickerEntries = [
  "🌿 Sarah M. funded 5t of carbon removal via Borneo Rainforest Regeneration · UK",
  "🌍 GreenTech Solutions funded 20t of emissions avoidance via Amazon REDD+ Forest Protection · Germany",
  "🌱 James K. funded 2t of carbon removal via Scottish Peatland Restoration · Scotland",
  "🌊 Ocean Labs funded 10t of carbon removal via Seagrass Meadow Restoration · USA",
  "🔥 Anonymous funded 3t of emissions avoidance via Efficient Cookstoves for Rural Families",
  "🌿 Priya R. funded 8t of carbon removal via Borneo Rainforest Regeneration · India",
  "🌍 Volta Energy funded 50t of emissions avoidance via Amazon REDD+ Forest Protection · France",
  "🌱 Tom & Ella funded 1t of carbon removal via Scottish Peatland Restoration · Ireland",
];

export default function Ticker() {
  // Duplicate entries for seamless loop
  const entries = [...tickerEntries, ...tickerEntries];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-[#111811]/60 py-3">
      {/* Fade left */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0a0f0a] to-transparent" />
      {/* Fade right */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0a0f0a] to-transparent" />

      <div className="flex whitespace-nowrap ticker-animate">
        {entries.map((entry, i) => (
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
