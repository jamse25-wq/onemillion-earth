"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface PurchaseData {
  buyerName: string;
  organisation: string | null;
  isAnonymous: boolean;
  tonnes: number;
  projectName: string;
  projectSlug: string;
  creditType: "removal" | "avoidance";
  registry: string;
  certificateId: string;
  carbonCostGbp: number;
  platformFeeGbp: number;
  totalGbp: number;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function creditTypeLabel(type: "removal" | "avoidance") {
  return type === "removal" ? "Carbon Removal" : "Emissions Avoidance";
}

function ShareButtons({ certificateId }: { certificateId: string }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = "https://onemillion.earth";
  const certUrl = `${siteUrl}/certificate/${certificateId}`;

  const tweetText = encodeURIComponent(
    `I just funded verified climate action on onemillion.earth — one tonne at a time. ${certUrl}`
  );
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(certUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/30 transition-colors text-sm font-medium"
      >
        Share on LinkedIn
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#e8f5e9] hover:bg-white/10 transition-colors text-sm font-medium"
      >
        Share on X
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3ddc84]/10 border border-[#3ddc84]/20 text-[#3ddc84] hover:bg-[#3ddc84]/20 transition-colors text-sm font-medium"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [data, setData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    fetch(`/api/purchase/session?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load purchase details.");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#3ddc84] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7aab8a]">Loading your certificate…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-[#7aab8a] mb-6">
            {error || "Something went wrong loading your purchase details."}
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-[#3ddc84] text-[#0a0f0a] font-semibold text-sm"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  const today = formatDate(new Date());
  const displayName =
    data.isAnonymous ? "Anonymous" : (data.organisation || data.buyerName);
  const shortId = data.certificateId.slice(0, 8).toUpperCase();
  const creditLabel = creditTypeLabel(data.creditType);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ddc84]/10 border border-[#3ddc84]/20 text-[#3ddc84] text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-[#3ddc84] animate-pulse" />
          Payment confirmed
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#e8f5e9] mb-3">
          Thank you, {data.isAnonymous ? "for your contribution" : data.buyerName.split(" ")[0]}.
        </h1>
        <p className="text-[#7aab8a] text-lg">
          Your funding has been received. The globe is a little greener.
        </p>
      </div>

      {/* Certificate card */}
      <div
        id="certificate"
        className="relative rounded-2xl overflow-hidden border border-[#3ddc84]/20 bg-[#0d120d] mb-8 print:border-none"
        style={{
          boxShadow:
            "0 0 0 1px rgba(61,220,132,0.15), 0 0 48px rgba(61,220,132,0.08)",
        }}
      >
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#3ddc84]/60 to-transparent" />

        <div className="p-8 sm:p-12">
          {/* Certificate header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[#3ddc84] text-xs font-semibold tracking-widest uppercase mb-1">
                Certificate of verified climate action
              </p>
              <p className="text-[#7aab8a]/60 text-xs">
                onemillion.earth · {today}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#7aab8a]/50 text-xs">Certificate ID</p>
              <p className="text-[#7aab8a] text-xs font-mono">{shortId}</p>
            </div>
          </div>

          {/* Central tonnes display */}
          <div className="text-center mb-10">
            <div className="inline-block">
              <p className="text-[#7aab8a]/70 text-sm mb-2">
                Funded by
              </p>
              <p className="text-[#e8f5e9] text-2xl font-bold mb-6">
                {displayName}
              </p>
              <div
                className="text-[#3ddc84] font-bold leading-none mb-2"
                style={{ fontSize: "clamp(4rem, 12vw, 7rem)" }}
              >
                {data.tonnes}
              </div>
              <p className="text-[#7aab8a] text-xl font-medium">
                {data.tonnes === 1 ? "tonne" : "tonnes"} of verified {creditLabel.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Project + registry row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 rounded-xl bg-[#111811] border border-white/5">
            <div>
              <p className="text-[#7aab8a]/60 text-xs mb-1">Project</p>
              <p className="text-[#e8f5e9] font-semibold text-sm leading-snug">
                {data.projectName}
              </p>
            </div>
            <div>
              <p className="text-[#7aab8a]/60 text-xs mb-1">Registry</p>
              <p className="text-[#e8f5e9] font-semibold text-sm">
                {data.registry}
              </p>
            </div>
            <div>
              <p className="text-[#7aab8a]/60 text-xs mb-1">Credit type</p>
              <p className="text-[#e8f5e9] font-semibold text-sm">
                {creditLabel}
              </p>
            </div>
            <div>
              <p className="text-[#7aab8a]/60 text-xs mb-1">Total paid</p>
              <p className="text-[#e8f5e9] font-semibold text-sm">
                £{data.totalGbp.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="flex items-center gap-6 justify-center text-xs text-[#7aab8a]/50 mb-10">
            <span>Carbon cost: £{data.carbonCostGbp.toFixed(2)}</span>
            <span>·</span>
            <span>Platform fee: £{data.platformFeeGbp.toFixed(2)}</span>
          </div>

          {/* Legal note */}
          <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-[#7aab8a]/40 text-xs leading-relaxed max-w-xl mx-auto">
              This certificate confirms that {data.tonnes}{" "}
              {data.tonnes === 1 ? "tonne" : "tonnes"} of verified{" "}
              {creditLabel.toLowerCase()} has been funded through onemillion.earth
              and retired in the {data.registry} registry. Funding a carbon
              credit is a climate contribution — it does not make any activity
              or organisation &ldquo;carbon neutral&rdquo;.
            </p>
            <p className="mt-4 text-[#3ddc84]/50 text-xs font-medium tracking-wide">
              onemillion.earth
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#3ddc84]/60 to-transparent" />
      </div>

      {/* Actions */}
      <div className="text-center space-y-6">
        <div>
          <p className="text-[#7aab8a] text-sm mb-4">Share your contribution</p>
          <ShareButtons certificateId={data.certificateId} />
        </div>

        <div>
          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-full border border-white/10 text-[#7aab8a] text-sm hover:border-white/20 hover:text-[#e8f5e9] transition-colors"
          >
            Download / Print certificate
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <Link
            href="/projects"
            className="text-[#3ddc84] text-sm hover:underline"
          >
            Browse more projects
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/leaderboard"
            className="text-[#7aab8a] text-sm hover:text-[#e8f5e9] transition-colors"
          >
            View leaderboard
          </Link>
          <span className="text-white/10">·</span>
          <Link
            href="/"
            className="text-[#7aab8a] text-sm hover:text-[#e8f5e9] transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#3ddc84] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
