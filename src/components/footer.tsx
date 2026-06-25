import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] mt-24 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white font-mono text-xs font-bold">
              G
            </div>
            <span className="font-mono text-sm font-semibold text-white">GITVERSE</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="/library" className="hover:text-gray-300 transition-colors">Library</Link>
            <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <a href="https://github.com/GraeLefix/GITVERSE" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
            <a href="http://gitverse.id" className="hover:text-gray-300 transition-colors">gitverse.id</a>
          </nav>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} GraeLefix</p>
        </div>
      </div>
    </footer>
  );
}
