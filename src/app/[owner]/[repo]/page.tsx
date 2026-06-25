import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RepoAnalysisView } from "@/components/repo-analysis-view";

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: `${owner}/${repo} — GITVERSE`,
    description: `Reverse-engineered build prompt for ${owner}/${repo}. Architecture breakdown, ASCII blueprint, and reconstruction prompt.`,
    alternates: { canonical: `http://gitverse.id/${owner}/${repo}` },
    openGraph: {
      title: `${owner}/${repo} | GITVERSE`,
      description: `Reverse-engineered prompt for ${owner}/${repo}`,
      images: [`https://opengraph.githubassets.com/1/${owner}/${repo}`],
    },
  };
}

export default async function RepoPage({ params }: Props) {
  const { owner, repo } = await params;
  if (!owner || !repo || owner.length > 64 || repo.length > 128) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <RepoAnalysisView owner={owner} repo={repo} />
      </main>
      <Footer />
    </>
  );
}
