import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-[#3ddc84] font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            onemillion.earth
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/projects"
              className="text-[#7aab8a] hover:text-[#e8f5e9] text-sm transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/leaderboard"
              className="text-[#7aab8a] hover:text-[#e8f5e9] text-sm transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="/why-carbon-credits"
              className="text-[#7aab8a] hover:text-[#e8f5e9] text-sm transition-colors"
            >
              Why Credits
            </Link>
            <Link
              href="/verify"
              className="text-[#7aab8a] hover:text-[#e8f5e9] text-sm transition-colors"
            >
              Verify
            </Link>
            <Link
              href="/projects"
              className="ml-2 px-4 py-2 rounded-full bg-[#3ddc84] text-[#0a0f0a] text-sm font-semibold hover:bg-[#3ddc84]/90 transition-colors"
            >
              Claim Your Segment
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-full bg-[#3ddc84] text-[#0a0f0a] text-xs font-semibold"
            >
              Claim Segment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
