import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hardware",
};

export default function HardwarePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#04020d] px-6 py-24 text-center text-white">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-semibold">Hardware</h1>
        <p className="text-base text-white/70">
          The dedicated hardware showcase is under construction. Check back soon for an in-depth look at
          Sense&rsquo;s design and engineering capabilities.
        </p>
      </div>
    </main>
  );
}


