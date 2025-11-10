"use client";

import Image, { type StaticImageData } from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import BluePod from "../../../assets/bluepod.png";
import GreenPod from "../../../assets/greenpod.png";
import LavenderPod from "../../../assets/lavenderpod.png";
import OrangePod from "../../../assets/orangepod.png";
import PurplePod from "../../../assets/purplepod.png";
import SilverPod from "../../../assets/silverpod.png";

type PodConfig = {
  image: StaticImageData;
  alt: string;
  initialRotation: number;
  hue: string;
  dropShadow: string;
};

const PODS: PodConfig[] = [
  {
    image: PurplePod,
    alt: "Sense wearable pod violet",
    initialRotation: -12,
    hue: "from-[#6366f1]/30 via-[#a855f7]/15 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(99,102,241,0.35)]",
  },
  {
    image: OrangePod,
    alt: "Sense wearable pod orange",
    initialRotation: -2,
    hue: "from-[#fb923c]/32 via-[#f97316]/18 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(251,146,60,0.38)]",
  },
  {
    image: GreenPod,
    alt: "Sense wearable pod green",
    initialRotation: 10,
    hue: "from-[#34d399]/32 via-[#22d3ee]/18 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(34,211,238,0.32)]",
  },
  {
    image: LavenderPod,
    alt: "Sense wearable pod lavender",
    initialRotation: -6,
    hue: "from-[#c084fc]/28 via-[#f0abfc]/18 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(192,132,252,0.32)]",
  },
  {
    image: SilverPod,
    alt: "Sense wearable pod silver",
    initialRotation: 4,
    hue: "from-[#94a3b8]/28 via-[#cbd5f5]/18 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(148,163,184,0.32)]",
  },
  {
    image: BluePod,
    alt: "Sense wearable pod cobalt",
    initialRotation: 14,
    hue: "from-[#3b82f6]/32 via-[#60a5fa]/18 to-transparent",
    dropShadow: "drop-shadow-[0_36px_120px_rgba(59,130,246,0.36)]",
  },
];

export function PodShowcase() {
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tilts, setTilts] = useState(
    PODS.map(() => ({ rotateX: 0, rotateY: 0, rotateZ: 0 })),
  );
  const [scrollTilt, setScrollTilt] = useState(0);

  const handleTilt =
    (index: number) => (event: MouseEvent<HTMLDivElement>) => {
      const node = tiltRefs.current[index];
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const rotateY = ((offsetX / rect.width) - 0.5) * 34;
      const rotateX = ((offsetY / rect.height) - 0.5) * -28;

      setTilts((prev) =>
        prev.map((tilt, idx) =>
          idx === index ? { rotateX, rotateY, rotateZ: tilt.rotateZ } : tilt,
        ),
      );
    };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY || 0;
      const rotation = Math.min(22, scrolled / 90);
      setScrollTilt(rotation);
      setTilts((prev) =>
        prev.map((tilt) => ({ ...tilt, rotateZ: rotation })),
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resetTilt = (index: number) => () => {
    setTilts((prev) =>
      prev.map((tilt, idx) =>
        idx === index ? { ...tilt, rotateX: 0, rotateY: 0 } : tilt,
      ),
    );
  };

  return (
    <div className="relative mt-12 grid w-full max-w-6xl grid-cols-1 gap-y-2 gap-x-6 md:grid-cols-3 md:mt-10 md:gap-y-4 md:gap-x-10">
      {PODS.map((pod, index) => {
        const tilt = tilts[index];
        return (
          <div
            key={pod.alt}
            ref={(el) => {
              tiltRefs.current[index] = el;
            }}
            className="relative flex h-[340px] w-full items-center justify-center px-2 md:h-[360px] md:px-4"
            style={{ perspective: "1700px" }}
            onMouseMove={handleTilt(index)}
            onMouseLeave={resetTilt(index)}
          >
            <div
              className={`pointer-events-none absolute inset-x-6 bottom-2 h-36 rounded-full bg-gradient-to-t ${pod.hue} blur-2xl opacity-70 transition-transform duration-500 ease-out`}
              style={{
                transform: `translateY(16px) scale(${1 + scrollTilt * 0.004})`,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[50%] border border-white/12 opacity-35 blur-xl transition-transform duration-500 ease-out"
              style={{
                transform: `translateZ(${54 + scrollTilt}px) rotateX(${tilt.rotateX * 0.35}deg) rotateY(${tilt.rotateY * 0.35}deg)`,
              }}
            />
            <Image
              src={pod.image}
              alt={pod.alt}
              priority={index === 1}
              className={`relative z-10 w-[78%] max-w-[400px] object-contain transition-transform duration-400 ease-out ${pod.dropShadow}`}
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + pod.initialRotation}deg) rotateZ(${tilt.rotateZ}deg) translateZ(${74 + scrollTilt * 1.5}px)` ,
                transformStyle: "preserve-3d",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
