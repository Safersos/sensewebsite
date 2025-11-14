import type { Metadata } from "next";
import ShaderBackground from "@/components/ui/shader-background";

export const metadata: Metadata = {
  title: "Neural",
};

export default function NeuralPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-24 text-center text-white">
      <ShaderBackground />
    </main>
  );
}


