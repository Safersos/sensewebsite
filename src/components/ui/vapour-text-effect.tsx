"use client";

import React, {
  createElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export enum Tag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  P = "p",
}

type VaporizeTextCycleProps = {
  texts: string[];
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  spread?: number;
  density?: number;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  direction?: "left-to-right" | "right-to-left";
  alignment?: "left" | "center" | "right";
  tag?: Tag;
};

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalOpacity: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
};

const DEFAULT_TEXTS = ["Next.js", "React"];

export const VaporizeTextDemo = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-black">
    <VaporizeTextCycle
      texts={["21st.dev", "Is", "Cool"]}
      font={{ fontFamily: "Inter, sans-serif", fontSize: "48px", fontWeight: 600 }}
      color="rgb(255,255,255)"
      alignment="center"
      tag={Tag.H1}
    />
  </div>
);

export default function VaporizeTextCycle({
  texts = DEFAULT_TEXTS,
  font = {
    fontFamily: "sans-serif",
    fontSize: "36px",
    fontWeight: 500,
  },
  color = "rgb(255,255,255)",
  spread = 5,
  density = 5,
  animation = {
    vaporizeDuration: 2,
    fadeInDuration: 1,
    waitDuration: 0.6,
  },
  direction = "left-to-right",
  alignment = "center",
  tag = Tag.P,
}: VaporizeTextCycleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const waitTimeoutRef = useRef<number | null>(null);
  const vaporizeProgressRef = useRef(0);
  const fadeOpacityRef = useRef(0);
  const lastFontRef = useRef<string | null>(null);

  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<"fadeIn" | "wait" | "vaporize" | "idle">("idle");

  const vaporizeDuration = Math.max(0.2, animation.vaporizeDuration ?? 2);
  const fadeInDuration = Math.max(0.2, animation.fadeInDuration ?? 1);
  const waitDuration = Math.max(0.2, animation.waitDuration ?? 0.6);
  const activeDensity = Math.min(Math.max(density, 0), 10);
  const spreadFactor = Math.max(spread, 0.5);

  const dpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1), []);
  const rgbColor = useMemo(() => parseColor(color), [color]);

  const wrapperStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      pointerEvents: "none" as const,
      position: "relative" as const,
    }),
    [],
  );

  const canvasStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      pointerEvents: "none" as const,
    }),
    [],
  );

  const currentText = useMemo(() => texts[currentIndex % texts.length], [texts, currentIndex]);

  const fontString = useMemo(() => {
    const px = parseInt(font.fontSize?.replace("px", "") || "36", 10);
    return `${font.fontWeight ?? 500} ${px * dpr}px ${font.fontFamily ?? "sans-serif"}`;
  }, [font.fontFamily, font.fontSize, font.fontWeight, dpr]);

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      particlesRef.current.forEach((particle) => {
        const clamped = Math.max(0, Math.min(1, particle.opacity));
        if (clamped <= 0.01) return;
        ctx.fillStyle = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${clamped})`;
        ctx.fillRect(particle.x / dpr, particle.y / dpr, 1, 1);
      });

      ctx.restore();
    },
    [dpr, rgbColor],
  );

  const prepareParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !wrapperSize.width || !wrapperSize.height) return;

    canvas.width = Math.max(1, Math.floor(wrapperSize.width * dpr));
    canvas.height = Math.max(1, Math.floor(wrapperSize.height * dpr));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.font = fontString;
    ctx.textBaseline = "middle";
    ctx.textAlign = alignment;

    const targetX = alignment === "left" ? 0 : alignment === "right" ? canvas.width : canvas.width / 2;
    const targetY = canvas.height / 2;

    ctx.fillText(currentText, targetX, targetY);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const sampleRate = Math.max(1, Math.round(dpr / Math.max(activeDensity * 0.2, 0.1)));

    const particles: Particle[] = [];
    for (let row = 0; row < height; row += sampleRate) {
      for (let col = 0; col < width; col += sampleRate) {
        const idx = (row * width + col) * 4;
        const alpha = data[idx + 3];
        if (alpha > 90) {
          const opacity = alpha / 255;
          particles.push({
            x: col,
            y: row,
            originalX: col,
            originalY: row,
            color: `rgba(${data[idx]}, ${data[idx + 1]}, ${data[idx + 2]}, ${opacity})`,
            opacity,
            originalOpacity: opacity,
            velocityX: 0,
            velocityY: 0,
            active: false,
          });
        }
      }
    }

    particlesRef.current = particles;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [alignment, currentText, dpr, fontString, wrapperSize.height, wrapperSize.width, activeDensity]);

  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !particlesRef.current.length) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (waitTimeoutRef.current) {
      clearTimeout(waitTimeoutRef.current);
      waitTimeoutRef.current = null;
    }

    vaporizeProgressRef.current = 0;
    fadeOpacityRef.current = 0;
    setPhase("fadeIn");

    const start = performance.now();

    const tick = (timestamp: number) => {
      const ctx2 = canvasRef.current?.getContext("2d");
      if (!ctx2) return;

      if (phase === "fadeIn") {
        const elapsed = (timestamp - start) / 1000;
        const progress = Math.min(1, elapsed / fadeInDuration);
        fadeOpacityRef.current = progress;

        particlesRef.current.forEach((particle) => {
          particle.opacity = particle.originalOpacity * progress;
          particle.x = particle.originalX;
          particle.y = particle.originalY;
          particle.velocityX = 0;
          particle.velocityY = 0;
          particle.active = false;
        });

        drawParticles(ctx2);

        if (progress >= 1) {
          setPhase("wait");
          waitTimeoutRef.current = window.setTimeout(() => {
            setPhase("vaporize");
            vaporizeProgressRef.current = 0;
            animationFrameRef.current = requestAnimationFrame(tick);
          }, waitDuration * 1000);
          return;
        }
      } else if (phase === "vaporize") {
        const delta = 1 / 60;
        vaporizeProgressRef.current += delta;
        const wave = Math.min(1, vaporizeProgressRef.current / vaporizeDuration);

        const canvasBounds = (canvasRef.current as HTMLCanvasElement & { textBoundaries?: { left: number; right: number; width: number } })?.textBoundaries;
        const waveX = canvasBounds
          ? direction === "left-to-right"
            ? canvasBounds.left + canvasBounds.width * wave
            : canvasBounds.right - canvasBounds.width * wave
          : wave * canvas.width;

        particlesRef.current.forEach((particle) => {
          const shouldActivate =
            direction === "left-to-right"
              ? particle.originalX <= waveX
              : particle.originalX >= waveX;

          if (shouldActivate) {
            if (!particle.active) {
              const angle = Math.random() * Math.PI * 2;
              const speed = (Math.random() * 0.8 + 0.3) * spreadFactor * 60;
              particle.velocityX = Math.cos(angle) * speed;
              particle.velocityY = Math.sin(angle) * speed;
              particle.active = true;
            }

            particle.x += (particle.velocityX * delta) / dpr;
            particle.y += (particle.velocityY * delta) / dpr;
            particle.opacity = Math.max(0, particle.opacity - delta * 1.2);
          }
        });

        drawParticles(ctx2);

        const stillVisible = particlesRef.current.some((p) => p.opacity > 0.05);
        if (!stillVisible || wave >= 1) {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setPhase("fadeIn");
          vaporizeProgressRef.current = 0;
          fadeOpacityRef.current = 0;
          prepareParticles();
        }
      } else {
        drawParticles(ctx2);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [drawParticles, fadeInDuration, prepareParticles, spreadFactor, texts.length, vaporizeDuration, waitDuration, direction, phase]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setWrapperSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });

    resizeObserver.observe(wrapperRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!wrapperSize.width || !wrapperSize.height) return;
    prepareParticles();
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawParticles(ctx);
  }, [prepareParticles, drawParticles, wrapperSize, currentText]);

  useEffect(() => {
    if (!isInView) {
      setPhase("idle");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
      return;
    }

    setPhase("fadeIn");
    runAnimation();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (waitTimeoutRef.current) {
        clearTimeout(waitTimeoutRef.current);
        waitTimeoutRef.current = null;
      }
    };
  }, [isInView, runAnimation, currentText]);

  useEffect(() => {
    const currentFont = font.fontFamily || "sans-serif";
    if (currentFont !== lastFontRef.current) {
      lastFontRef.current = currentFont;
      const timeoutId = window.setTimeout(() => {
        prepareParticles();
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) drawParticles(ctx);
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  }, [font.fontFamily, prepareParticles, drawParticles]);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <SeoElement tag={tag} texts={texts} />
    </div>
  );
}

const SeoElement = memo(({ tag = Tag.P, texts }: { tag: Tag; texts: string[] }) => {
  const safeTag = Object.values(Tag).includes(tag) ? tag : Tag.P;
  return createElement(
    safeTag,
    {
      style: {
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      },
      "aria-hidden": true,
    },
    texts.join(" "),
  );
});

function parseColor(input: string) {
  const rgba = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] ? Number(rgba[4]) : 1,
    };
  }

  if (input.startsWith("#")) {
    const hex = input.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
  }

  return { r: 255, g: 255, b: 255, a: 1 };
}

