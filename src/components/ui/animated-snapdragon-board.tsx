"use client";

import Image, { type StaticImageData } from "next/image";

import SnapdragonCenter from "../../../assets/snapdragon.png";
import SamsungLpddr from "../../../assets/LPDDR5.png";
import SamsungEmmc from "../../../assets/eMMC.png";
import QualcommPmic from "../../../assets/PMIC.png";
import SenseMcu from "../../../assets/SENSEMCU.png";
import PcbTexture from "../../../assets/pcb2.png";

type ChipSpec = {
    id: string;
    image: StaticImageData;
    width: number;
    height: number;
    x: number; // 0 - 1 (percentage of board width)
    y: number; // 0 - 1 (percentage of board height)
    delay: number;
    glowColor: string;
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
    },
];

const BOARD_DIMENSION = 400;
const CORE_SIZE = 108;
const CORE_SCALE = (CORE_SIZE / BOARD_DIMENSION) * 100;

export function AnimatedSnapdragonBoard() {
    return (
        <div className="glass-board group relative mx-auto aspect-square w-full max-w-[420px]">
            <div className="glass-board__texture-wrapper">
                <Image
                    src={PcbTexture}
                    alt="PCB substrate"
                    fill
                    priority
                    className="glass-board__texture"
                    sizes="(min-width: 768px) 280px, 55vw"
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

                <g className="node-group">
                    {NODE_POSITIONS.map((node, index) => (
                        <circle
                            key={`node-${index}`}
                            className="trace-node"
                            cx={node.x}
                            cy={node.y}
                            r="7"
                            style={{ animationDelay: `${index * 0.35}s` }}
                        />
                    ))}
                </g>
            </svg>

            <div className="core-chip absolute" style={{ left: `calc(50% - ${CORE_SIZE / 2}px)`, top: `calc(50% - ${CORE_SIZE / 2}px)`, width: CORE_SIZE, height: CORE_SIZE }}>
                <div className="core-chip__glow" />
                <Image
                    src={SnapdragonCenter}
                    alt="Snapdragon 8 Elite"
                    fill
                    priority
                    className="core-chip__image"
                    sizes="(min-width: 768px) 180px, 33vw"
                />
                <div className="core-chip__frame" />
                <div className="core-chip__glass" />
            </div>

            {CHIP_SPECS.map((chip) => (
                <div
                    key={chip.id}
                    className="chip-card"
                    style={{
                        top: `${chip.y * 100}%`,
                        left: `${chip.x * 100}%`,
                        width: `${chip.width}px`,
                        height: `${chip.height}px`,
                        animationDelay: `${chip.delay}s`,
                    }}
                >
                    <div className="chip-card__glow" style={{ background: chip.glowColor }} />
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
            ))}
        </div>
    );
}

const HOLES = [
    { x: 62, y: 62 },
    { x: 338, y: 62 },
    { x: 62, y: 338 },
    { x: 338, y: 338 },
];

const TRACES: string[] = [
    "M200 200 C182 174 156 148 108 110",
    "M200 200 C226 176 254 150 304 120",
    "M200 200 C236 214 266 226 320 240",
    "M200 200 C172 236 150 258 112 284",
];

const NODE_POSITIONS = [
    { x: 108, y: 110 },
    { x: 304, y: 120 },
    { x: 320, y: 240 },
    { x: 112, y: 284 },
];

