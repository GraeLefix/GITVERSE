import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "GITVERSE — Reverse Engineer Any Codebase",
    template: "%s | GITVERSE",
  },
  description:
    "Paste code or a GitHub URL, get a complete architecture breakdown and copy-paste-ready AI reconstruction prompt. Supports any language or framework.",
  keywords: [
    "reverse engineering", "code analysis", "AI coding", "GitHub", "build prompt",
    "Cursor", "Claude", "Codex", "developer tools", "codebase analysis",
  ],
  authors: [{ name: "GraeLefix", url: "https://github.com/GraeLefix" }],
  creator: "GraeLefix",
  metadataBase: new URL("http://gitverse.id"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://gitverse.id",
    siteName: "GITVERSE",
    title: "GITVERSE — Reverse Engineer Any Codebase",
    description: "Paste code or a GitHub URL and get a complete architecture breakdown + AI reconstruction prompt.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GITVERSE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GITVERSE — Reverse Engineer Any Codebase",
    description: "Turn any codebase into a build prompt for AI coding agents.",
    images: ["/og.png"],
    creator: "@GraeLefix",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f17" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={[fontSans.variable, fontMono.variable].join(" ")}>
      <body className="bg-[#0f0f17] text-white antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
