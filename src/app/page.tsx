import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";

export const metadata: Metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <HeroSection />
    </div>
  );
}
