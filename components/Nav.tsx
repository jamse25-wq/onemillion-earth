import Link from "next/link";

export default function Nav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <header
        className="max-w-[900px] mx-auto rounded-full bg-[#1a1a1a] px-5 py-3"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-semibold text-base tracking-tight hover:opacity-80 transition-opacity"
          >
            onemillion.earth
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/projects"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/leaderboard"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/why-carbon-credits"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Why Credits
            </Link>
            <Link
              href="/verify"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Verify
            </Link>
            <Link
              href="/projects"
              className="ml-1 px-4 py-2 rounded-full bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245a41] transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(45,106,79,0.3)" }}
            >
              Claim Your Segment
            </Link>
          </nav>

          {/* Mobile: just logo + CTA */}
          <div className="md:hidden">
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-full bg-[#2d6a4f] text-white text-xs font-semibold"
            >
              Claim Segment
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
