"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageCard {
  id: string;
  src: string | StaticImageData;
  alt: string;
  rotation: number;
}

interface ImageCarouselHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  ctaText: string;
  onCtaClick?: () => void;
  images: ImageCard[];
  features?: Array<{
    title: string;
    description: string;
  }>;
  showContent?: boolean;
  className?: string;
}

export function ImageCarouselHero({
  title,
  subtitle,
  description,
  ctaText,
  onCtaClick,
  images,
  features = [
    {
      title: "Realistic Results",
      description: "Realistic results that feel professionally crafted.",
    },
    {
      title: "Fast Generation",
      description: "Turn ideas into visuals in seconds.",
    },
    {
      title: "Diverse Styles",
      description: "Choose from a wide range of artistic options.",
    },
  ],
  showContent = true,
  className,
}: ImageCarouselHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotatingCards, setRotatingCards] = useState<number[]>([]);
  const baseAngles = useMemo(
    () =>
      images.length
        ? images.map((_, index) => index * (360 / images.length))
        : [0, 90, 180, 270],
    [images.length],
  );
  const cardsInView = useInView(cardsRef, {
    amount: 0.4,
    margin: "-15% 0px -15% 0px",
    once: false,
  });
  const [rotationActive, setRotationActive] = useState(false);

  useEffect(() => {
    setRotatingCards(baseAngles);
  }, [baseAngles]);

  useEffect(() => {
    if (!rotationActive) {
      setRotatingCards(baseAngles);
      return;
    }
    const interval = window.setInterval(() => {
      setRotatingCards((prev) =>
        prev.map((angle, index) => {
          const next = (angle + 0.5) % 360;
          return Number.isNaN(next) ? baseAngles[index] : next;
        }),
      );
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [baseAngles, rotationActive]);

  useEffect(() => {
    let startTimer: number | undefined;
    if (cardsInView) {
      startTimer = window.setTimeout(() => setRotationActive(true), 700);
    } else {
      setRotationActive(false);
    }

    return () => {
      if (startTimer) {
        clearTimeout(startTimer);
      }
    };
  }, [cardsInView]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  const renderedCards = useMemo(() => {
    const stackSpacing = 36;
    return images.map((image, index) => {
      const angle = ((rotatingCards[index] || 0) * Math.PI) / 180;
      const radius = 70;
      const orbitX = Math.cos(angle) * radius;
      const orbitY = Math.sin(angle) * radius;

      const stackedY =
        (index - (images.length - 1) / 2) * stackSpacing;

      const perspectiveX = rotationActive
        ? (mousePosition.x - 0.5) * 18
        : 0;
      const perspectiveY = rotationActive
        ? (mousePosition.y - 0.5) * 18
        : 0;

      return (
        <motion.div
          key={image.id}
          className="absolute flex h-16 w-16 items-center justify-center sm:h-18 sm:w-18"
          initial={{ opacity: 0, scale: 0.6, y: stackedY + 20 }}
          animate={
            cardsInView
              ? {
                  opacity: 1,
                  scale: 1,
                  x: rotationActive ? orbitX : 0,
                  y: rotationActive ? orbitY : stackedY,
                  rotateX: perspectiveY,
                  rotateY: perspectiveX,
                  rotateZ: rotationActive ? image.rotation : 0,
                }
              : {
                  opacity: 0,
                  scale: 0.6,
                  x: 0,
                  y: stackedY + 20,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                }
          }
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: index * 0.18,
          }}
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.15 }}
        >
          <div
            className={cn(
              "group relative h-full w-full overflow-hidden rounded-full border border-white/15 bg-white/10 shadow-[0_6px_18px_rgba(80,80,120,0.22)] backdrop-blur",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
              priority={index < 3}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </motion.div>
      );
    });
  }, [
    cardsInView,
    images,
    mousePosition.x,
    mousePosition.y,
    rotatingCards,
    rotationActive,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden min-h-[70vh] sm:min-h-[80vh]", className)}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-tr from-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div
          className="perspective relative mb-12 h-96 w-full max-w-6xl sm:mb-16 sm:h-[500px]"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setMousePosition((position) => ({ ...position }))}
          style={{ perspective: "1200px" }}
          ref={cardsRef}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {renderedCards}
          </div>
        </div>

        {showContent ? (
          <>
            <div className="relative z-20 mx-auto mb-12 max-w-2xl text-center sm:mb-16">
              {subtitle && (
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-primary/70">
                  {subtitle}
                </p>
              )}
              <h1 className="text-balance mb-4 text-4xl font-serif font-bold leading-tight text-foreground sm:mb-6 sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="text-balance mb-8 text-lg text-muted-foreground sm:text-xl">
                {description}
              </p>
              <button
                onClick={onCtaClick}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground",
                  "transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                )}
              >
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="relative z-20 mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  className={cn(
                    "group rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-300",
                    "hover:border-border hover:bg-card/80",
                  )}
                >
                  <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}


