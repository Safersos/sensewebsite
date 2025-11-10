"use client";

import Image from "next/image";
import {
  motion,
  useAnimationControls,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const logos = [
  { id: "chatgpt", src: "/assets/logos/chatgpt.png", alt: "ChatGPT logo" },
  { id: "gemini", src: "/assets/logos/gemini.png", alt: "Gemini logo" },
  { id: "anthropic", src: "/assets/logos/anthropic.png", alt: "Anthropic logo" },
  { id: "deepseek", src: "/assets/logos/deepseek.png", alt: "DeepSeek logo" },
];

export function CircularLogosScroll() {
  const prefersReducedMotion = useReducedMotion();
  const [direction, setDirection] = useState<1 | -1>(1);
  const rotation = useMotionValue(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.6,
    triggerOnce: false,
  });
  const lastY = useRef<number | null>(null);
  const hasActivated = useRef(false);
  const sequenceRunning = useRef(false);
  const controlChatgpt = useAnimationControls();
  const controlGemini = useAnimationControls();
  const controlAnthropic = useAnimationControls();
  const controlDeepseek = useAnimationControls();
  const controls = useMemo(
    () => [controlChatgpt, controlGemini, controlAnthropic, controlDeepseek],
    [controlAnthropic, controlChatgpt, controlDeepseek, controlGemini],
  );

  useEffect(() => {
    const currentY = entry?.boundingClientRect.y ?? null;
    if (currentY !== null) {
      if (lastY.current !== null && currentY < lastY.current) {
        setDirection(1);
      } else if (lastY.current !== null && currentY > lastY.current) {
        setDirection(-1);
      }
      lastY.current = currentY;
    }
  }, [entry]);

  useEffect(() => {
    const runSequence = async () => {
      if (sequenceRunning.current) return;
      sequenceRunning.current = true;
      for (let index = 0; index < controls.length; index += 1) {
        await controls[index].start({
          opacity: 1,
          scale: 1,
          transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.05 },
        });
      }
      sequenceRunning.current = false;
      hasActivated.current = true;
    };

    if (inView) {
      controls.forEach((control, index) => {
        control.start({
          opacity: 0,
          scale: 0.6,
          transition: { duration: 0.001, delay: 0.02 * index },
        });
      });
      requestAnimationFrame(runSequence);
    } else {
      hasActivated.current = false;
      sequenceRunning.current = false;
      controls.forEach((control) => {
        control.stop();
        control.start({
          opacity: 0,
          scale: 0.6,
          transition: { duration: 0.2 },
        });
      });
      rotation.set(0);
    }
  }, [controls, inView, rotation]);

  useAnimationFrame(
    (time, delta) => {
      if (!inView || prefersReducedMotion || !hasActivated.current) return;
      const current = rotation.get();
      const increment = (delta / 8000) * 360 * direction;
      rotation.set(current + increment);
    },
    [direction, inView, prefersReducedMotion],
  );

  return (
    <section ref={ref} className="relative flex min-h-[60vh] w-full items-center justify-center py-24">
      <motion.div
        className="relative h-64 w-64 rounded-full border border-white/10 bg-white/5 p-12 shadow-[0_36px_120px_rgba(30,20,60,0.35)] backdrop-blur"
        style={{ rotate: rotation }}
      >
        {logos.map((logo, index) => {
          const angle = (index / logos.length) * Math.PI * 2;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          return (
            <motion.div
              key={logo.id}
              className="absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_12px_32px_rgba(90,90,160,0.35)] backdrop-blur"
              style={{
                top: `${50 + y * 40}%`,
                left: `${50 + x * 40}%`,
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={controls[index]}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}


