"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type GeneratedPath = {
  id: number;
  d: string;
  opacity: number;
  width: number;
  offset: number;
};

function FloatingPaths({ position }: { position: number }) {
  const paths = React.useMemo<GeneratedPath[]>(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const depth = i / 32;
        const directional = position >= 0 ? 1 : -1;
        const startX = -160 + directional * i * 14;
        const baseY = 40 + i * 8;
        const amplitude = 46 + depth * 70;
        const curvature = 120 + depth * 60;
        const waveOffset = Math.sin((i + 1) * 0.45) * (18 + depth * 20) * directional;
        const spread = 620 + depth * 40;

        const midX = startX + spread * 0.45;
        const endX = startX + spread;
        const endY = baseY + Math.sin(i * 0.32 + directional * 0.6) * (22 + depth * 18);

        const d = [
          `M ${startX} ${baseY}`,
          `C ${startX + curvature * 0.55} ${baseY - amplitude - waveOffset}`,
          `${midX - curvature * 0.2} ${baseY + amplitude * 0.6}`,
          `${midX} ${baseY}`,
          `S ${midX + curvature * 0.35} ${baseY - amplitude * 0.65}`,
          `${endX} ${endY}`,
        ].join(" ");

        return {
          id: i,
          d,
          opacity: 0.12 + depth * 0.55,
          width: 0.6 + depth * 1.1,
          offset: (directional * depth) / 2.4,
        };
      }),
    [position]
  );

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            animate={{
              pathLength: [0.35, 1, 0.35],
              opacity: [
                path.opacity * 0.45,
                path.opacity,
                path.opacity * 0.45,
              ],
              pathOffset: [0, path.offset, 0],
            }}
            initial={{ pathLength: 0.2, opacity: path.opacity * 0.4 }}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
            transition={{
              duration: 28 + path.id * 0.9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title = "Background Paths",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  const words = React.useMemo(() => title.split(" "), [title]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mx-auto max-w-4xl"
        >
          {children ?? (
            <>
              <h1 className="mb-8 text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
                {words.map((word, wordIndex) => (
                  <span key={wordIndex} className="mr-4 inline-block last:mr-0">
                    {word.split("").map((letter, letterIndex) => (
                      <motion.span
                        key={`${wordIndex}-${letterIndex}`}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay: wordIndex * 0.1 + letterIndex * 0.03,
                          type: "spring",
                          stiffness: 150,
                          damping: 25,
                        }}
                        className="inline-block bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent dark:from-white dark:to-white/80"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
              <div className="group relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-black/10 to-white/10 p-px shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl dark:from-white/10 dark:to-black/10">
                <Button
                  variant="ghost"
                  className="rounded-[1.15rem] border border-black/10 bg-white/95 px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:bg-white dark:border-white/10 dark:bg-black/95 dark:text-white dark:hover:bg-black group-hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-neutral-800/50"
                >
                  <span className="opacity-90 transition-opacity group-hover:opacity-100">
                    Discover Excellence
                  </span>
                  <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">
                    →
                  </span>
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

