import type { Metadata } from "next";
import { ReversePromptHome } from "@/components/reverse-prompt-home";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "GITVERSE — Reverse Engineer Any Codebase",
  alternates: { canonical: "http://gitverse.id" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GITVERSE",
  url: "http://gitverse.id",
  description:
    "Reverse engineer any codebase into a build prompt. Paste code, get architecture breakdown + AI-ready reconstruction prompt.",
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <Navbar />
      <main>
        <ReversePromptHome />
      </main>
      <Footer />
    </>
  );
}
