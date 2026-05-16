"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";

interface PriceCalculatorProps {
  project: Project;
}

const PLATFORM_FEE_RATE = 0.18;

export default function PriceCalculator({ project }: PriceCalculatorProps) {
  const [tonnes, setTonnes] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carbonCost = project.pricePerTonneGbp * tonnes;
  const platformFee = carbonCost * PLATFORM_FEE_RATE;
  const total = carbonCost + platformFee;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTonnes(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(100, Math.max(1, Number(e.target.value) || 1));
    setTonnes(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAnonymous && !buyerName.trim()) {
      setError("Please enter your name, or tick 'Stay anonymous'.");
      return;
    }
    if (!buyerEmail.trim()) {
      setError("Email address is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: project.slug,
          tonnes,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          isAnonymous,
          organisation: organisation.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111811] border border-white/8 rounded-2xl p-6 glow-border">
      <h2 className="text-[#e8f5e9] font-semibold text-lg mb-6">
        Fund this project
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Tonnes selector */}
        <div className="mb-6">
          <label className="block text-[#7aab8a] text-sm mb-3">
            How many tonnes?
          </label>
          <div className="flex items-center gap-4 mb-3">
            <input
              type="range"
              min="1"
              max="100"
              value={tonnes}
              onChange={handleSliderChange}
              className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3ddc84 ${tonnes}%, rgba(61,220,132,0.15) ${tonnes}%)`,
              }}
            />
            <input
              type="number"
              min="1"
              max="100"
              value={tonnes}
              onChange={handleInputChange}
              className="w-16 px-2 py-1.5 rounded-lg bg-[#162016] border border-white/10 text-[#e8f5e9] text-sm text-center focus:outline-none focus:border-[#3ddc84]/40"
            />
          </div>
          <p className="text-[#7aab8a]/50 text-xs">
            1–100 tonnes per transaction
          </p>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 mb-6 p-4 rounded-xl bg-[#0a0f0a]/60 border border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[#7aab8a] text-sm">
              Carbon cost ({tonnes} {tonnes === 1 ? "tonne" : "tonnes"} ×
              £{project.pricePerTonneGbp})
            </span>
            <span className="text-[#e8f5e9] text-sm font-medium">
              £{carbonCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#7aab8a] text-sm">Platform fee (18%)</span>
            <span className="text-[#e8f5e9] text-sm font-medium">
              £{platformFee.toFixed(2)}
            </span>
          </div>
          <div className="pt-3 border-t border-white/8 flex justify-between items-center">
            <span className="text-[#e8f5e9] font-semibold">Total</span>
            <span className="text-[#3ddc84] font-bold text-xl">
              £{total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Buyer details */}
        <div className="space-y-4 mb-6">
          {/* Anonymous toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors ${
                  isAnonymous ? "bg-[#3ddc84]/70" : "bg-white/10"
                }`}
              />
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnonymous ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-[#7aab8a] text-sm group-hover:text-[#e8f5e9] transition-colors">
              Stay anonymous on the leaderboard
            </span>
          </label>

          {/* Name */}
          {!isAnonymous && (
            <div>
              <label className="block text-[#7aab8a] text-xs mb-1.5">
                Your name <span className="text-[#3ddc84]">*</span>
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Alex Chen"
                required={!isAnonymous}
                className="w-full px-3 py-2.5 rounded-lg bg-[#162016] border border-white/10 text-[#e8f5e9] text-sm placeholder:text-[#7aab8a]/30 focus:outline-none focus:border-[#3ddc84]/40"
              />
            </div>
          )}

          {/* Organisation */}
          <div>
            <label className="block text-[#7aab8a] text-xs mb-1.5">
              Organisation{" "}
              <span className="text-[#7aab8a]/50">(optional)</span>
            </label>
            <input
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="e.g. Acme Ltd"
              className="w-full px-3 py-2.5 rounded-lg bg-[#162016] border border-white/10 text-[#e8f5e9] text-sm placeholder:text-[#7aab8a]/30 focus:outline-none focus:border-[#3ddc84]/40"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#7aab8a] text-xs mb-1.5">
              Email address <span className="text-[#3ddc84]">*</span>
            </label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 rounded-lg bg-[#162016] border border-white/10 text-[#e8f5e9] text-sm placeholder:text-[#7aab8a]/30 focus:outline-none focus:border-[#3ddc84]/40"
            />
            <p className="mt-1 text-[#7aab8a]/40 text-xs">
              For your certificate — never shown publicly
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all ${
            loading
              ? "bg-[#3ddc84]/20 text-[#3ddc84]/50 cursor-not-allowed border border-[#3ddc84]/10"
              : "bg-[#3ddc84] text-[#0a0f0a] hover:bg-[#3ddc84]/90 cursor-pointer"
          }`}
        >
          {loading ? "Redirecting to payment…" : `Proceed to Payment — £${total.toFixed(2)}`}
        </button>

        {/* Small print */}
        <p className="mt-4 text-[#7aab8a]/50 text-xs leading-relaxed">
          Platform fee covers verification, operations and ongoing project
          monitoring. It is not a carbon cost. All carbon costs are passed
          directly to the registry.
        </p>
      </form>
    </div>
  );
}
