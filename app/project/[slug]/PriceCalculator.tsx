"use client";

import { useState } from "react";
import { Project } from "@/lib/projects";

interface PriceCalculatorProps {
  project: Project;
}

const PLATFORM_FEE_RATE = 0.18;

export default function PriceCalculator({ project }: PriceCalculatorProps) {
  const [tonnes, setTonnes] = useState(1);

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

  return (
    <div className="bg-[#111811] border border-white/8 rounded-2xl p-6 glow-border">
      <h2 className="text-[#e8f5e9] font-semibold text-lg mb-6">
        Fund this project
      </h2>

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

      {/* CTA */}
      <button
        disabled
        className="w-full py-3.5 rounded-full bg-[#3ddc84]/20 text-[#3ddc84]/50 font-semibold cursor-not-allowed text-sm border border-[#3ddc84]/10"
      >
        Proceed to Payment — coming soon
      </button>

      {/* Small print */}
      <p className="mt-4 text-[#7aab8a]/50 text-xs leading-relaxed">
        Platform fee covers verification, operations and ongoing project
        monitoring. It is not a carbon cost. All carbon costs are passed
        directly to the registry.
      </p>
    </div>
  );
}
