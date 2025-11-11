"use client";

import Image, { type StaticImageData } from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTime, useTransform } from "framer-motion";

import SnapdragonCenter from "../../../assets/snapdragon.png";
import SamsungLpddr from "../../../assets/LPDDR5.png";
import SamsungEmmc from "../../../assets/eMMC.png";
import QualcommPmic from "../../../assets/PMIC.png";
import SenseMcu from "../../../assets/SENSEMCU.png";
import PcbTexture from "../../../assets/pcb2.png";

type ChipResponsiveOverride = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
};

type ChipSpec = {
    id: string;
    image: StaticImageData;
    width: number;
    height: number;
    x: number; // 0 - 1 (percentage of board width)
    y: number; // 0 - 1 (percentage of board height)
    delay: number;
    glowColor: string;
    sm?: ChipResponsiveOverride;
};

type BubbleParticle = {
  tx: number;
  ty: number;
  bounceTx: number;
  bounceTy: number;
  size: number;
  delay: number;
  duration: number;
};

const CHIP_SPECS: ChipSpec[] = [
    {
        id: "lpddr5",
        image: SamsungLpddr,
        width: 96,
        height: 64,
        x: 0.28,
        y: 0.28,
        delay: 0.45,
        glowColor: "rgba(59, 130, 246, 0.35)",
        sm: {
            x: 0.26,
            y: 0.26,
        },
    },
    {
        id: "emmc",
        image: SamsungEmmc,
        width: 96,
        height: 64,
        x: 0.72,
        y: 0.28,
        delay: 0.85,
        glowColor: "rgba(249, 115, 22, 0.38)",
        sm: {
            x: 0.83,
            y: 0.32,
        },
    },
    {
        id: "pmic",
        image: QualcommPmic,
        width: 96,
        height: 64,
        x: 0.78,
        y: 0.60,
        delay: 1.2,
        glowColor: "rgba(16, 185, 129, 0.32)",
        sm: {
            x: 0.80,
            y: 0.64,
        },
    },
    {
        id: "sense-mcu",
        image: SenseMcu,
        width: 96,
        height: 64,
        x: 0.28,
        y: 0.70,
        delay: 1.55,
        glowColor: "rgba(96, 165, 250, 0.32)",
        sm: {
            x: 0.27,
            y: 0.73,
        },
    },
];

const BOARD_DIMENSION = 400;
const CORE_SIZE = 108;
const CORE_SCALE = (CORE_SIZE / BOARD_DIMENSION) * 100;

const BUBBLE_PARTICLES: BubbleParticle[] = [
  { tx: -100, ty: -120, bounceTx: -160, bounceTy: -40, size: 12, delay: 0, duration: 4 },
  { tx: -150, ty: -20, bounceTx: -80, bounceTy: 60, size: 10, delay: 0.5, duration: 4.2 },
  { tx: -60, ty: -140, bounceTx: 10, bounceTy: -180, size: 13, delay: 1, duration: 4.4 },
  { tx: 90, ty: -120, bounceTx: 150, bounceTy: -40, size: 11, delay: 0.8, duration: 4 },
  { tx: 150, ty: -50, bounceTx: 200, bounceTy: 20, size: 12, delay: 1.2, duration: 4.6 },
  { tx: 180, ty: 40, bounceTx: 120, bounceTy: 120, size: 10, delay: 1.6, duration: 4.3 },
  { tx: 120, ty: 130, bounceTx: 40, bounceTy: 180, size: 12, delay: 2, duration: 4.1 },
  { tx: 50, ty: 170, bounceTx: -30, bounceTy: 140, size: 9, delay: 2.5, duration: 4.5 },
  { tx: -70, ty: 160, bounceTx: -150, bounceTy: 110, size: 11, delay: 1.8, duration: 4.2 },
  { tx: -150, ty: 90, bounceTx: -90, bounceTy: 10, size: 12, delay: 2.1, duration: 4.8 },
  { tx: -110, ty: -40, bounceTx: -30, bounceTy: -100, size: 9, delay: 2.6, duration: 4.4 },
  { tx: 40, ty: -160, bounceTx: 120, bounceTy: -120, size: 10, delay: 3, duration: 4.6 },
  { tx: 180, ty: -10, bounceTx: 120, bounceTy: -80, size: 8, delay: 1.4, duration: 4.1 },
  { tx: 110, ty: 80, bounceTx: 40, bounceTy: 30, size: 9, delay: 0.9, duration: 4.3 },
  { tx: -20, ty: 150, bounceTx: 60, bounceTy: 110, size: 8, delay: 2.8, duration: 4.5 },
  { tx: -170, ty: -90, bounceTx: -120, bounceTy: -10, size: 10, delay: 3.3, duration: 4.7 },
];

const POWER_PULSE_DELAYS = [0, 1.8, 3.6];

export function AnimatedSnapdragonBoard() {
    const boardRef = useRef<HTMLDivElement>(null);
    const [isCompact, setIsCompact] = useState(false);
    const [isZoomSuppressed, setIsZoomSuppressed] = useState(false);
    const [suppressRemembered, setSuppressRemembered] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        const updateMatch = () => setIsCompact(mediaQuery.matches);
        updateMatch();
        mediaQuery.addEventListener("change", updateMatch);
        return () => {
            mediaQuery.removeEventListener("change", updateMatch);
        };
    }, []);
    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) {
            return;
        }
        const { visualViewport } = window;
        const handleZoom = () => {
            const scale = visualViewport?.scale ?? 1;
            const shouldSuppress = scale > 1.18;
            setIsZoomSuppressed(shouldSuppress);
            setSuppressRemembered((prev) => prev || shouldSuppress);
        };
        handleZoom();
        visualViewport.addEventListener("resize", handleZoom);
        visualViewport.addEventListener("scroll", handleZoom);
        return () => {
            visualViewport.removeEventListener("resize", handleZoom);
            visualViewport.removeEventListener("scroll", handleZoom);
        };
    }, []);
    const isLowPowerMode = isCompact || isZoomSuppressed || suppressRemembered;
    const { scrollYProgress } = useScroll({
        target: boardRef,
        offset: ["start 92%", "end 8%"],
    });

    const springConfig = { stiffness: 160, damping: 18, mass: 0.4 };
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -14]), springConfig);
    const rotateY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-16, 0, 14]), springConfig);
    const lift = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [56, 0, -38]), springConfig);
    const wobblePresence = useSpring(useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]), {
        stiffness: 120,
        damping: 20,
        mass: 0.4,
    });
    const time = useTime();
    const wobble = useTransform([time, wobblePresence], ([timestamp, presence]) => {
        const safeTime = typeof timestamp === "number" ? timestamp : 0;
        const safePresence = typeof presence === "number" ? presence : 0;
        const radians = (safeTime / 6000) * Math.PI * 2;
        return safePresence * Math.sin(radians) * 8.5;
    });
    const rotateYWithWobble = useTransform([rotateY, wobble], ([base, wobbleValue]) => {
        const safeBase = typeof base === "number" ? base : 0;
        const safeWobble = typeof wobbleValue === "number" ? wobbleValue : 0;
        return safeBase + safeWobble;
    });

    return (
        <motion.div
            ref={boardRef}
            className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[460px] 2xl:max-w-[500px]"
            style={{
                perspective: isLowPowerMode ? 1100 : 1600,
                y: isLowPowerMode ? 0 : lift,
            }}
        >
            <motion.div
                className={`glass-board group relative h-full w-full${isLowPowerMode ? " is-low-power" : ""}`}
                style={{
                    rotateX: isLowPowerMode ? 0 : rotateX,
                    rotateY: isLowPowerMode ? 0 : rotateYWithWobble,
                    transformStyle: isLowPowerMode ? "flat" : "preserve-3d",
                    willChange: "transform",
                }}
            >
            <div className="glass-board__texture-wrapper">
                <Image
                    src={PcbTexture}
                    alt="PCB substrate"
                    fill
                    priority
                    className="glass-board__texture"
                    sizes="(min-width: 1536px) 500px, (min-width: 1280px) 460px, (min-width: 1024px) 420px, (min-width: 640px) 380px, 70vw"
                />
            </div>
            <svg
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
            >
                <defs>
                    <linearGradient id="board-gradient" x1="15%" y1="0%" x2="85%" y2="100%">
                        <stop offset="0%" stopColor="rgba(148, 163, 184, 0.18)" />
                        <stop offset="45%" stopColor="rgba(51, 65, 85, 0.08)" />
                        <stop offset="100%" stopColor="rgba(15, 23, 42, 0.5)" />
                    </linearGradient>
                    <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(248, 250, 252, 1)" />
                        <stop offset="100%" stopColor="rgba(14, 165, 233, 0)" />
                    </radialGradient>
                </defs>

                <rect
                    x="22"
                    y="22"
                    width="356"
                    height="356"
                    rx="42"
                    fill="url(#board-gradient)"
                    className="board-surface"
                />
                <rect x="40" y="40" width="320" height="320" rx="36" className="board-inner-border" />

                {HOLES.map((hole, index) => (
                    <g key={`hole-${index}`} transform={`translate(${hole.x} ${hole.y})`}>
                        <circle r="16" className="hole-ring" />
                        <circle r="9" className="hole-core" />
                    </g>
                ))}

                <g className="trace-group">
                    {TRACES.map((path, index) => (
                        <path key={`trace-${index}`} d={path} className="trace-path" style={{ animationDelay: `${index * 0.22}s` }} />
                    ))}
                </g>

      </svg>

            <div className="floating-bubbles" style={{ opacity: isLowPowerMode ? 0 : 1 }}>
                {BUBBLE_PARTICLES.map((bubble, index) => (
                    <span
                        key={`bubble-${index}`}
                        className="bubble-particle"
                        style={{
                            animationDelay: `${bubble.delay}s`,
                            animationDuration: `${bubble.duration}s`,
                            animationPlayState: isLowPowerMode ? "paused" : undefined,
                            opacity: isLowPowerMode ? 0 : undefined,
                            "--tx": `${bubble.tx}px`,
                            "--ty": `${bubble.ty}px`,
                            "--bounce-tx": `${bubble.bounceTx}px`,
                            "--bounce-ty": `${bubble.bounceTy}px`,
                            "--bubble-size": `${bubble.size}px`,
                        } as CSSProperties}
                    />
                ))}
            </div>
            <div className="core-chip absolute" style={{ left: `calc(50% - ${CORE_SIZE / 2}px)`, top: `calc(50% - ${CORE_SIZE / 2}px)`, width: CORE_SIZE, height: CORE_SIZE }}>
                {POWER_PULSE_DELAYS.map((delay) => (
                    <span
                        key={`pulse-${delay}`}
                        className="core-chip__pulse"
                        style={{
                            animationDelay: `${delay}s`,
                            animationPlayState: isLowPowerMode ? "paused" : undefined,
                            opacity: isLowPowerMode ? 0 : undefined,
                        }}
                    />
                ))}
                <div
                    className="core-chip__glow"
                    style={
                        isLowPowerMode
                            ? {
                                  opacity: 0.55,
                                  filter: "blur(26px)",
                              }
                            : undefined
                    }
                />
                <Image
                    src={SnapdragonCenter}
                    alt="Snapdragon 8 Elite"
                    fill
                    priority
                    className="core-chip__image"
                    sizes="(min-width: 1536px) 240px, (min-width: 1280px) 220px, (min-width: 1024px) 190px, (min-width: 640px) 170px, 38vw"
                />
                <div className="core-chip__frame" />
                <div className="core-chip__glass" />
            </div>

            {CHIP_SPECS.map((chip) => {
                const overrides = isCompact ? chip.sm : undefined;
                const effectiveX = overrides?.x ?? chip.x;
                const effectiveY = overrides?.y ?? chip.y;
                const effectiveWidth = overrides?.width ?? chip.width;
                const effectiveHeight = overrides?.height ?? chip.height;

                const pulseGlow = isLowPowerMode
                    ? undefined
                    : {
                          background: chip.glowColor,
                      };

                return (
                    <div
                        key={chip.id}
                        className="chip-card"
                        style={{
                            top: `${effectiveY * 100}%`,
                            left: `${effectiveX * 100}%`,
                            width: `${effectiveWidth}px`,
                            height: `${effectiveHeight}px`,
                            animationPlayState: isLowPowerMode ? "paused" : undefined,
                            animationDelay: `${chip.delay}s`,
                        }}
                    >
                        <div className="chip-card__glow" style={pulseGlow} />
                        <div className="chip-card__body">
                            <Image
                                src={chip.image}
                                alt={chip.id.replace("-", " ")}
                                fill
                                sizes="140px"
                                className="chip-card__image"
                                priority={chip.id === "lpddr5"}
                            />
                            <div className="chip-card__frame" />
                            <div className="chip-card__glass" />
                        </div>
                    </div>
                );
            })}

            </motion.div>
        </motion.div>
    );
}

const HOLES = [
    { x: 62, y: 62 },
    { x: 338, y: 62 },
    { x: 62, y: 338 },
    { x: 338, y: 338 },
];

const TRACES: string[] = [
    "M200 200 C184 174 154 146 108 110",
    "M200 200 C224 176 254 150 304 120",
    "M200 200 C236 214 266 226 320 240",
    "M200 200 C172 236 150 258 112 284",
];

