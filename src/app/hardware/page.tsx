import type { Metadata } from "next";
import { AnimatedSnapdragonBoard } from "@/components/ui/animated-snapdragon-board";
import { Lightning } from "@/components/ui/hero-odyssey";

export const metadata: Metadata = {
  title: "Hardware",
};

export default function HardwarePage() {
  const lightningHue = 220;

  return (
    <main className="relative flex min-h-screen flex-col bg-[#04020d] text-white">
      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_bottom,_rgba(79,56,176,0.32),rgba(16,12,45,0.72)_64%)] px-4 pt-24 pb-24 sm:px-6 sm:pt-28 sm:pb-28 md:px-12 lg:px-20 lg:pb-32 xl:px-24 2xl:px-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute top-[55%] left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500/15 via-purple-600/10 to-transparent blur-3xl sm:h-[680px] sm:w-[680px] md:h-[760px] md:w-[760px] lg:h-[820px] lg:w-[820px]" />
          <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2">
            <Lightning
              hue={lightningHue}
              xOffset={0}
              speed={0.55}
              intensity={0.5}
              size={2.4}
              variance={0.9}
              flashFrequency={0.72}
              flashDuration={0.18}
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center text-white/80">
          <span className="text-[10px] uppercase tracking-[0.32em] text-white/60 sm:text-xs md:text-sm">
            Snapdragon 8 Elite Core
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-white sm:text-3xl lg:mt-6 lg:text-[44px]">
            Powering Sense with Qualcomm Precision
          </h1>
          <p className="mt-3 max-w-2xl text-xs text-white/70 sm:text-sm md:text-base lg:max-w-3xl lg:text-lg">
            Snapdragon silicon orchestrates every biometric, haptic, and neural routine inside Sense, working in harmony with Samsung memory and Qualcomm power management.
          </p>
        </div>

        <div className="relative z-10 mt-10 w-full max-w-5xl px-2 sm:mt-12 sm:px-4">
          <AnimatedSnapdragonBoard />
        </div>
      </section>
    </main>
  );
}


