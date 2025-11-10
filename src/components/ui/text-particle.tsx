"use client";

import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;
}

interface TextParticleAnimationProps {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleColor?: string;
  particleDensity?: number;
  backgroundColor?: string;
  className?: string;
}

export function TextParticle({
  text,
  fontSize = 80,
  fontFamily = "Arial, sans-serif",
  particleSize = 2,
  particleColor = "#000000",
  particleDensity = 8,
  backgroundColor = "transparent",
  className = "",
}: TextParticleAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initText = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.fillText(text, x, y);

      const textImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const newParticles: Particle[] = [];

      for (let row = 0; row < textImage.height; row += particleDensity) {
        for (let col = 0; col < textImage.width; col += particleDensity) {
          const index = (row * textImage.width + col) * 4;
          const alpha = textImage.data[index + 3];

          if (alpha > 128) {
            newParticles.push({
              x: col,
              y: row,
              size: particleSize,
              baseX: col,
              baseY: row,
              density: Math.random() * 30 + 1,
              color: particleColor,
            });
          }
        }
      }

      setParticles(newParticles);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initText();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [fontFamily, fontSize, particleColor, particleDensity, particleSize, text]);

  useEffect(() => {
    if (!particles.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((particle) => {
        let forceDirectionX = 0;
        let forceDirectionY = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100 && distance !== 0) {
            forceDirectionX = (dx / distance) * 3;
            forceDirectionY = (dy / distance) * 3;
          }
        }

        const moveX = forceDirectionX + (particle.baseX - particle.x) * 0.05;
        const moveY = forceDirectionY + (particle.baseY - particle.y) * 0.05;

        particle.x += moveX;
        particle.y += moveY;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [backgroundColor, mouse, particles]);

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setMouse({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMouse({ x: null, y: null });
  };

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

