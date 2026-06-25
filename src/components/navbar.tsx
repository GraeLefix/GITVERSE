"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Pricing" },
];

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e1e2e] bg-[#0f0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white font-mono text-xs font-bold group-hover:bg-indigo-500 transition-colors">
            G
          </div>
          <span className="font-mono text-sm font-semibold tracking-wider text-white">GITVERSE</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                pathname === href
                  ? "bg-[#1e1e2e] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1a27]"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/GraeLefix/GITVERSE"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#2a2a3e] px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-indigo-500 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
