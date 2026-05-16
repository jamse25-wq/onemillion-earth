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
    <div
      className="rounded-2xl p-6"
      style={{
        border: "1px solid #e0e8e0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        background: "white",
      }}
    >
      <h2 className="text-[#1a1a1a] font-semibold text-lg mb-6">
        Fund this project
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Tonnes selector */}
        <div className="mb-6">
          <label className="block text-[#555f55] text-sm mb-3">
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
                background: `linear-gradient(to right, #2d6a4f ${tonnes}%, #e0e8e0 ${tonnes}%)`,
              }}
            />
            <input
              type="number"
              min="1"
              max="100"
              value={tonnes}
              onChange={handleInputChange}
              className="w-16 px-2 py-1.5 rounded-lg text-[#1a1a1a] text-sm text-center focus:outline-none"
              style={{
                border: "1px solid #e0e8e0",
                background: "#f8f9f8",
              }}
            />
          </div>
          <p className="text-[#555f55] text-xs">1–100 tonnes per transaction</p>
        </div>

        {/* Price breakdown */}
        <div
          className="space-y-3 mb-6 p-4 rounded-xl"
          style={{ background: "#f8f9f8", border: "1px solid #e0e8e0" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-[#555f55] text-sm">
              Carbon cost ({tonnes} {tonnes === 1 ? "tonne" : "tonnes"} ×
              £{project.pricePerTonneGbp})
            </span>
            <span className="text-[#1a1a1a] text-sm font-medium">
              £{carbonCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#555f55] text-sm">Platform fee (18%)</span>
            <span className="text-[#1a1a1a] text-sm font-medium">
              £{platformFee.toFixed(2)}
            </span>
          </div>
          <div
            className="pt-3 flex justify-between items-center"
            style={{ borderTop: "1px solid #e0e8e0" }}
          >
            <span className="text-[#1a1a1a] font-semibold">Total</span>
            <span className="font-bold text-xl" style={{ color: "#2d6a4f" }}>
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
                className="w-10 h-5 rounded-full transition-colors"
                style={{
                  background: isAnonymous ? "#2d6a4f" : "#e0e8e0",
                }}
              />
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm"
                style={{
                  transform: isAnonymous
                    ? "translateX(20px)"
                    : "translateX(2px)",
                }}
              />
            </div>
            <span className="text-[#555f55] text-sm group-hover:text-[#1a1a1a] transition-colors">
              Stay anonymous on the leaderboard
            </span>
          </label>

          {/* Name */}
          {!isAnonymous && (
            <div>
              <label className="block text-[#555f55] text-xs mb-1.5">
                Your name{" "}
                <span style={{ color: "#2d6a4f" }}>*</span>
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Alex Chen"
                required={!isAnonymous}
                className="w-full px-3 py-2.5 rounded-lg text-[#1a1a1a] text-sm placeholder:text-[#555f55]/40 focus:outline-none"
                style={{
                  border: "1px solid #e0e8e0",
                  background: "white",
                }}
              />
            </div>
          )}

          {/* Organisation */}
          <div>
            <label className="block text-[#555f55] text-xs mb-1.5">
              Organisation{" "}
              <span className="text-[#555f55]">(optional)</span>
            </label>
            <input
              type="text"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="e.g. Acme Ltd"
              className="w-full px-3 py-2.5 rounded-lg text-[#1a1a1a] text-sm placeholder:text-[#555f55]/40 focus:outline-none"
              style={{
                border: "1px solid #e0e8e0",
                background: "white",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#555f55] text-xs mb-1.5">
              Email address{" "}
              <span style={{ color: "#2d6a4f" }}>*</span>
            </label>
            <input
              type="email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 rounded-lg text-[#1a1a1a] text-sm placeholder:text-[#555f55]/40 focus:outline-none"
              style={{
                border: "1px solid #e0e8e0",
                background: "white",
              }}
            />
            <p className="mt-1 text-[#555f55] text-xs">
              For your certificate — never shown publicly
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full font-semibold text-sm transition-all"
          style={
            loading
              ? {
                  background: "#f8f9f8",
                  color: "#555f55",
                  border: "1px solid #e0e8e0",
                  cursor: "not-allowed",
                }
              : {
                  background: "#2d6a4f",
                  color: "white",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(45,106,79,0.25)",
                }
          }
        >
          {loading
            ? "Redirecting to payment…"
            : `Proceed to Payment — £${total.toFixed(2)}`}
        </button>

        {/* Small print */}
        <p className="mt-4 text-[#555f55] text-xs leading-relaxed">
          Platform fee covers verification, operations and ongoing project
          monitoring. It is not a carbon cost. All carbon costs are passed
          directly to the registry.
        </p>
      </form>
    </div>
  );
}
