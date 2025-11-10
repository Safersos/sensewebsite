import { PodShowcase } from "@/components/ui/pod-showcase";

export default function HardwarePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-[#04020d] px-6 py-24 text-center text-white">
      <div className="mt-10 max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold">Hardware Pods</h1>
        <p className="text-base text-white/70">
          Explore the Sense pod lineup in motion. Each module responds to cursor movement and scroll for a tangible,
          tactile preview of the hardware experience.
        </p>
      </div>
      <PodShowcase />
    </main>
  );
}


