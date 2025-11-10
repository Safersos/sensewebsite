"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { TextParticle } from "@/components/ui/text-particle";
import { AnimatedSnapdragonBoard } from "@/components/ui/animated-snapdragon-board";
import { Fingerprint, Sparkles } from "lucide-react";
import PodGif from "../../../assets/pod.gif";

export function HeroSection() {
  const shootingStars = [
    { top: "18%", left: "6%", duration: "5.5s", delay: "0s" },
    { top: "32%", left: "15%", duration: "6.2s", delay: "-2.4s" },
    { top: "58%", left: "8%", duration: "5.8s", delay: "-1.2s" },
    { top: "22%", left: "65%", duration: "6.5s", delay: "-3.6s" },
    { top: "46%", left: "72%", duration: "5.9s", delay: "-4.8s" },
    { top: "70%", left: "60%", duration: "6.3s", delay: "-2.9s" },
    { top: "12%", left: "40%", duration: "5.4s", delay: "-1.7s" },
    { top: "78%", left: "25%", duration: "6.1s", delay: "-4.2s" },
    { top: "35%", left: "82%", duration: "5.7s", delay: "-0.9s" },
    { top: "62%", left: "50%", duration: "6.8s", delay: "-3.1s" },
    { top: "48%", left: "5%", duration: "5.6s", delay: "-2.6s" },
    { top: "15%", left: "88%", duration: "6.4s", delay: "-1.4s" },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[120vh] flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_bottom,_rgba(79,56,176,0.32),rgba(16,12,45,0.72)_64%)] px-6 py-32 pb-48 text-white md:px-16 lg:px-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(140,128,255,0.16),transparent_74%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="shooting-stars h-full w-full">
          {shootingStars.map((star, index) => (
            <span
              key={index}
              className="shooting-star"
              style={{
                top: star.top,
                left: star.left,
                "--shoot-duration": star.duration,
                "--shoot-delay": star.delay,
              } as CSSProperties}
            />
          ))}
        </div>
      </div>
      <span className="pointer-events-auto absolute left-4 top-[16vh] hidden -translate-y-14 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm uppercase tracking-[0.32em] text-white/70 backdrop-blur-md md:block lg:left-10">
        Welcome to Sense
      </span>
      <div className="pointer-events-none relative z-10 flex justify-center px-6 pt-10 text-center md:px-16 lg:px-24">
        <div className="pointer-events-auto relative mx-auto max-w-5xl select-none text-balance text-center text-white/80">
          <p className="text-3xl font-semibold leading-tight text-white/25 sm:text-4xl md:text-6xl">
            The future of intelligence is
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
            <span className="fingerprint-glow inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-400/10 sm:h-16 sm:w-16">
              <Fingerprint className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            <span>human</span>
            <span className="text-white/60">+</span>
            <span className="ai-glow inline-flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 sm:h-16 sm:w-16">
              <Sparkles className="h-8 w-8 sm:h-9 sm:w-9" />
            </span>
            <span>AI</span>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-14 w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-6 text-center shadow-[0_20px_60px_rgba(10,8,30,0.45)] backdrop-blur-xl">
        <div className="relative mx-auto h-56 w-full max-w-3xl">
          <CpuArchitecture className="h-full w-full text-white/95" />
        </div>
      </div>
      <div className="relative z-10 mt-24 flex w-full max-w-5xl flex-col items-center text-center">
        <div className="relative flex w-full max-w-3xl flex-col items-center gap-[2px]">
          <div className="h-[68px] w-full">
            <TextParticle
              text="Sense is your real world Jarvis"
              fontSize={32}
              fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
              particleSize={1}
              particleDensity={1}
              particleColor="#f8fafc"
              className="w-full"
            />
          </div>
        </div>
        <div className="relative mt-6 w-full max-w-3xl">
          <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
            <Image
              src={PodGif}
              alt="Sense pod animation"
              priority
              unoptimized
              className="w-full max-w-[480px] drop-shadow-[0_30px_60px_rgba(10,8,30,0.55)]"
            />
          </div>
        </div>
        <div className="relative mt-20 flex w-full max-w-4xl flex-col items-center px-6 text-white/80">
          <span className="text-xs uppercase tracking-[0.32em] text-white/50">
            Snapdragon 8 Elite Core
          </span>
          <h3 className="mt-6 text-2xl font-semibold text-white">
            Powering Sense with Qualcomm Precision
          </h3>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Snapdragon silicon orchestrates every biometric, haptic, and neural routine inside Sense, working in harmony
            with Samsung memory and Qualcomm power management.
          </p>
          <div className="relative mt-10 w-full">
            <AnimatedSnapdragonBoard />
          </div>
        </div>
      </div>
    </section>
  );
}


