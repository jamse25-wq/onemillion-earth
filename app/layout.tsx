import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "onemillion.earth — Fund verified carbon action",
    template: "%s | onemillion.earth",
  },
  description:
    "The globe is divided into one million segments. Each tonne you fund fills one. Help us fund one million tonnes of verified carbon action — one tonne at a time.",
  metadataBase: new URL("https://onemillion.earth"),
  openGraph: {
    siteName: "onemillion.earth",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0f0a] text-[#e8f5e9] font-sans antialiased min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
