import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e0e8e0] bg-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-[#2d6a4f] font-semibold text-lg tracking-tight"
            >
              onemillion.earth
            </Link>
            <p className="mt-3 text-[#555f55] text-sm leading-relaxed max-w-xs">
              Funding one million tonnes of verified carbon action — one tonne
              at a time.
            </p>
            <p className="mt-4 text-[#555f55]/60 text-xs">
              Globe updated daily.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[#1a1a1a] text-xs font-semibold uppercase tracking-widest mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/projects"
                  className="text-[#555f55] hover:text-[#1a1a1a] text-sm transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="text-[#555f55] hover:text-[#1a1a1a] text-sm transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/verify"
                  className="text-[#555f55] hover:text-[#1a1a1a] text-sm transition-colors"
                >
                  Verify
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[#1a1a1a] text-xs font-semibold uppercase tracking-widest mb-4">
              Learn
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/why-carbon-credits"
                  className="text-[#555f55] hover:text-[#1a1a1a] text-sm transition-colors"
                >
                  Why Carbon Credits
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#555f55] hover:text-[#1a1a1a] text-sm transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-[#e0e8e0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-[#555f55]/60 text-xs">
            © {new Date().getFullYear()} onemillion.earth. Registry purchases
            are reviewed weekly by the founding team.
          </p>
          <p className="text-[#555f55]/60 text-xs">
            Not investment advice. Carbon credits do not make any activity
            &quot;carbon neutral&quot;.
          </p>
        </div>
      </div>
    </footer>
  );
}
