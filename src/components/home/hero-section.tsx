"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { CpuArchitecture } from "@/components/ui/cpu-architecture";
import { Fingerprint, Sparkles } from "lucide-react";

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
  const extendedSectionDrift = useSpring(useTransform(scrollYProgress, [0, 1], [40, 0]), springConfig);

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
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_bottom,_rgba(79,56,176,0.32),rgba(16,12,45,0.72)_64%)] px-4 pt-24 pb-40 text-white sm:px-8 sm:pt-28 sm:pb-40 md:px-14 lg:px-20 xl:px-24 2xl:px-36"
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
      <span className="pointer-events-auto absolute left-4 top-[7vh] -translate-y-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-md sm:left-6 sm:top-[14vh] sm:-translate-y-24 sm:text-sm md:hidden">
        Welcome to Sense
      </span>
      <span className="pointer-events-auto absolute left-6 top-[14vh] hidden -translate-y-14 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm uppercase tracking-[0.32em] text-white/70 backdrop-blur-md md:block lg:left-12 xl:left-16">
        Welcome to Sense
      </span>
      <motion.div
        className="pointer-events-none relative z-10 flex justify-center px-2 pt-8 text-center sm:px-6 sm:pt-10 md:px-10 lg:px-16 xl:px-20"
        style={{ y: introDrift }}
      >
        <div className="pointer-events-auto relative mx-auto max-w-4xl select-none text-balance text-center text-white/80">
          <p className="text-[30px] font-semibold uppercase tracking-[0.22em] text-white/25 sm:text-[30px] md:text-[32px] md:leading-tight lg:text-[36px] xl:text-[40px] 2xl:text-[46px]">
            The future of intelligence is
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[28px] font-semibold text-white sm:text-3xl md:gap-5 md:text-4xl xl:text-5xl">
            <span className="fingerprint-glow inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300/50 bg-emerald-400/10 sm:h-12 sm:w-12 xl:h-14 xl:w-14">
              <Fingerprint className="h-7 w-7 sm:h-7 sm:w-7 xl:h-8 xl:w-8" />
            </span>
            <span className="text-base tracking-[0.32em] text-white/80 sm:text-base md:text-lg">HUMAN</span>
            <span className="text-white/60">+</span>
            <span className="ai-glow inline-flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/10 sm:h-12 sm:w-12 xl:h-14 xl:w-14">
              <Sparkles className="h-7 w-7 sm:h-7 sm:w-7 xl:h-8 xl:w-8" />
            </span>
            <span className="text-base tracking-[0.32em] text-white/80 sm:text-base md:text-lg">AI</span>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="relative z-10 mt-8 w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-5 text-center shadow-[0_18px_50px_rgba(10,8,30,0.45)] backdrop-blur-xl sm:mt-16 lg:mt-14 lg:p-6 xl:mt-16 xl:max-w-[900px]"
        style={{ y: corePanelDrift }}
      >
        <div className="relative mx-auto h-44 w-full max-w-md sm:h-48 sm:max-w-lg lg:h-48 lg:max-w-[460px] xl:h-50 xl:max-w-[520px]">
          <CpuArchitecture className="h-full w-full text-white/95" />
        </div>
      </motion.div>
      <motion.div className="relative z-10 mt-28 w-full sm:mt-32 md:mt-36 lg:mt-40" style={{ y: extendedSectionDrift }}>
        <div className="mx-auto w-full max-w-6xl rounded-[28px] border border-white/10 bg-gradient-to-b from-white/6 via-white/4 to-white/5 px-6 py-8 shadow-[0_24px_72px_rgba(8,6,28,0.5)] backdrop-blur-2xl sm:px-10 sm:py-12 lg:px-14">
          <AnimatedHero />
        </div>
      </motion.div>
    </section>
  );
}


