"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const primarySpring = { stiffness: 180, damping: 24, mass: 0.6 };
const trailSpring = { stiffness: 90, damping: 22, mass: 0.8 };

export function NeuralCursor() {
  const [isEnabled, setIsEnabled] = useState(true);
  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const glowX = useSpring(pointerX, primarySpring);
  const glowY = useSpring(pointerY, primarySpring);
  const trailX = useSpring(pointerX, trailSpring);
  const trailY = useSpring(pointerY, trailSpring);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const updateEnabled = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsEnabled(event.matches);
    };
    updateEnabled(media);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updateEnabled);
    } else {
      media.addListener(updateEnabled);
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", updateEnabled);
      } else {
        media.removeListener(updateEnabled);
      }
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;
    const updatePointer = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [isEnabled, pointerX, pointerY]);

  if (!isEnabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 hidden select-none md:block"
    >
      <motion.div
        className="pointer-events-none absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: trailX,
          y: trailY,
          background:
            "radial-gradient(circle at center, rgba(52, 255, 202, 0.18) 0%, rgba(52, 255, 202, 0.06) 50%, transparent 80%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="pointer-events-none absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle at center, rgba(56, 249, 255, 0.55) 0%, rgba(56, 249, 255, 0.15) 55%, transparent 75%)",
          boxShadow: "0 0 60px rgba(56, 249, 255, 0.35)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.85) 0%, rgba(56,249,255,0.35) 60%, transparent 100%)",
          boxShadow: "0 0 30px rgba(171, 255, 248, 0.45)",
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}

