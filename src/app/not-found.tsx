import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <div className="font-mono text-8xl font-bold text-[#1e1e2e] select-none">404</div>
        <h1 className="mt-4 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-gray-400">
          This repo might be private, or the URL might be incorrect.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            Try another repo
          </Link>
          <Link
            href="/library"
            className="rounded-md border border-[#2a2a3e] px-5 py-2.5 text-sm font-medium text-gray-300 hover:border-indigo-500 hover:text-white transition-colors"
          >
            Browse library
          </Link>
        </div>
      </main>
    </>
  );
}
