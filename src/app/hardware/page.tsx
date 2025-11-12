import Image from "next/image";
import type { Metadata } from "next";
import { AnimatedSnapdragonBoard } from "@/components/ui/animated-snapdragon-board";
import { TextParticle } from "@/components/ui/text-particle";
import PodGif from "../../../assets/pod.gif";

export const metadata: Metadata = {
  title: "Hardware",
};

export default function HardwarePage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#04020d] text-white">
      <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_bottom,_rgba(79,56,176,0.32),rgba(16,12,45,0.72)_64%)] px-4 pt-28 pb-32 sm:px-8 md:px-14 lg:px-20 xl:px-24 2xl:px-36">
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center text-white/80">
          <span className="text-xs uppercase tracking-[0.32em] text-white/50 sm:text-sm">
            Snapdragon 8 Elite Core
          </span>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl lg:text-[44px]">
            Powering Sense with Qualcomm Precision
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base lg:max-w-3xl lg:text-lg">
            Snapdragon silicon orchestrates every biometric, haptic, and neural routine inside Sense, working in harmony
            with Samsung memory and Qualcomm power management.
          </p>
        </div>

        <div className="relative z-10 mt-12 w-full max-w-6xl">
          <AnimatedSnapdragonBoard />
        </div>

        <div className="relative z-10 mt-16 flex w-full max-w-5xl flex-col items-center text-center">
          <div className="h-[36px] w-full max-w-xl sm:h-[44px] lg:h-[50px] xl:h-[58px]">
            <TextParticle
              text="Sense is your real world Jarvis"
              fontSize={22}
              fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
              particleSize={1}
              particleDensity={1}
              particleColor="#f8fafc"
              className="w-full"
            />
          </div>

          <div className="relative mt-[-18px] w-full max-w-xl sm:mt-[-20px]">
            <div className="relative mx-auto flex w-full max-w-[360px] items-center justify-center sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[520px] 2xl:max-w-[560px]">
              <Image
                src={PodGif}
                alt="Sense pod animation"
                priority
                unoptimized
                className="w-full max-w-[360px] drop-shadow-[0_30px_60px_rgba(10,8,30,0.55)] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[520px] 2xl:max-w-[560px]"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


