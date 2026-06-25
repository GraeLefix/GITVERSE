import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PricingView } from "@/components/pricing-view";

export const metadata: Metadata = {
  title: "Pricing — GITVERSE",
  description: "Simple, transparent pricing for GITVERSE. Free tier available.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen"><PricingView /></main>
      <Footer />
    </>
  );
}
