import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LibraryView } from "@/components/library-view";

export const metadata: Metadata = {
  title: "Prompt Library — GITVERSE",
  description: "Browse community-saved reverse-engineering prompts for popular GitHub repositories.",
};

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen"><LibraryView /></main>
      <Footer />
    </>
  );
}
