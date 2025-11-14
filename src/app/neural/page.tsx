import type { Metadata } from "next";
import ShaderBackground from "@/components/ui/shader-background";

export const metadata: Metadata = {
  title: "Neural",
};

export default function NeuralPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-24 text-center text-white">
      <ShaderBackground />
      <div className="relative z-10 max-w-2xl space-y-4">
        <h1 className="text-4xl font-semibold">Neural Interface</h1>
        <p className="text-base text-white/70">
          Outline the neural tools, workflows, and experiences Sense enables. Replace this
          placeholder with the final content architecture when available.
        </p>
      </div>
    </main>
  );
}


