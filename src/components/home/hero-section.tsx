"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { TextParticle } from "@/components/ui/text-particle";
import { AnimatedSnapdragonBoard } from "@/components/ui/animated-snapdragon-board";
import { Fingerprint, Sparkles } from "lucide-react";
import PodGif from "../../../assets/pod.gif";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 10%"],
  });

  const springConfig = { stiffness: 120, damping: 20, mass: 0.6 };
  const backgroundDrift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -220]), springConfig);
  const introDrift = useSpring(useTransform(scrollYProgress, [0, 1], [0, 110]), springConfig);
  const corePanelDrift = useSpring(useTransform(scrollYProgress, [0, 1], [0, 180]), springConfig);
  const chipDeckDrift = useSpring(useTransform(scrollYProgress, [0, 1], [0, 220]), springConfig);

  const shootingStars = [
    { top: "18%", left: "12%", duration: "5.8s", delay: "0s" },
    { top: "48%", left: "8%", duration: "6.3s", delay: "-1.8s" },
    { top: "22%", left: "68%", duration: "6.6s", delay: "-3.4s" },
    { top: "46%", left: "76%", duration: "6.1s", delay: "-4.6s" },
    { top: "70%", left: "58%", duration: "6.4s", delay: "-2.7s" },
    { top: "12%", left: "42%", duration: "5.6s", delay: "-1.2s" },
    { top: "78%", left: "28%", duration: "6.2s", delay: "-3.8s" },
    { top: "35%", left: "84%", duration: "5.9s", delay: "-0.7s" },
    { top: "88%", left: "66%", duration: "6.2s", delay: "-4.1s" },
    { top: "76%", left: "52%", duration: "5.9s", delay: "-4.8s" },
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_bottom,_rgba(79,56,176,0.32),rgba(16,12,45,0.72)_64%)] px-4 pt-36 pb-40 text-white sm:px-8 sm:pt-28 sm:pb-40 md:px-14 lg:px-20 xl:px-24 2xl:px-36"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(140,128,255,0.16),transparent_74%)]"
        style={{ y: backgroundDrift }}
      />
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
      <span className="pointer-events-auto absolute left-4 top-[10.5vh] -translate-y-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-md sm:left-6 sm:top-[14vh] sm:-translate-y-24 sm:text-sm md:hidden">
        Welcome to Sense
      </span>
      <span className="pointer-events-auto absolute left-6 top-[14vh] hidden -translate-y-14 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm uppercase tracking-[0.32em] text-white/70 backdrop-blur-md md:block lg:left-12 xl:left-16">
        Welcome to Sense
      </span>
      <motion.div
        className="pointer-events-none relative z-10 flex justify-center px-2 pt-20 text-center sm:px-6 sm:pt-10 md:px-10 lg:px-16 xl:px-20"
        style={{ y: introDrift }}
      >
        <div className="pointer-events-auto relative mx-auto max-w-4xl select-none text-balance text-center text-white/80">
          <p className="text-[26px] font-semibold uppercase tracking-[0.22em] text-white/25 sm:text-[30px] md:text-[32px] md:leading-tight lg:text-[36px] xl:text-[40px] 2xl:text-[46px]">
            The future of intelligence is
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-2xl font-semibold text-white sm:text-3xl md:gap-5 md:text-4xl xl:text-5xl">
            <span className="fingerprint-glow inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-400/10 sm:h-12 sm:w-12 xl:h-14 xl:w-14">
              <Fingerprint className="h-6 w-6 sm:h-7 sm:w-7 xl:h-8 xl:w-8" />
            </span>
            <span className="text-sm tracking-[0.32em] text-white/80 sm:text-base md:text-lg">HUMAN</span>
            <span className="text-white/60">+</span>
            <span className="ai-glow inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 sm:h-12 sm:w-12 xl:h-14 xl:w-14">
              <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 xl:h-8 xl:w-8" />
            </span>
            <span className="text-sm tracking-[0.32em] text-white/80 sm:text-base md:text-lg">AI</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative z-10 mt-10 w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 text-center shadow-[0_18px_50px_rgba(10,8,30,0.45)] backdrop-blur-xl sm:mt-16 lg:mt-20 lg:p-6 xl:max-w-4xl"
        style={{ y: corePanelDrift }}
      >
        <div className="relative mx-auto h-44 w-full max-w-md sm:h-48 sm:max-w-lg lg:h-52 xl:h-56 xl:max-w-xl">
          <CpuArchitecture className="h-full w-full text-white/95" />
        </div>
      </motion.div>
      <motion.div
        className="relative z-10 mt-14 flex w-full max-w-6xl flex-col items-center text-center sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28"
        style={{ y: chipDeckDrift }}
      >
        <div className="relative flex w-full max-w-xl flex-col items-center sm:max-w-2xl">
          <div className="h-[36px] w-full sm:h-[44px] lg:h-[50px] xl:h-[58px]">
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
        <div className="relative mt-4 flex w-full max-w-4xl flex-col items-center px-3 text-white/80 sm:mt-8 sm:px-6 lg:mt-10">
          <span className="text-xs uppercase tracking-[0.32em] text-white/50 sm:text-sm">
            Snapdragon 8 Elite Core
          </span>
          <h3 className="mt-5 text-xl font-semibold text-white sm:text-3xl lg:text-[34px]">
            Powering Sense with Qualcomm Precision
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-white/60 sm:text-base lg:max-w-3xl lg:text-lg">
            Snapdragon silicon orchestrates every biometric, haptic, and neural routine inside Sense, working in harmony
            with Samsung memory and Qualcomm power management.
          </p>
          <div className="relative mt-8 w-full lg:mt-14">
            <AnimatedSnapdragonBoard />
          </div>
        </div>
      </motion.div>
    </section>
  );
}


