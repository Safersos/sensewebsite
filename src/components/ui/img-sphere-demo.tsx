"use client";

import React from "react";

import SphereImageGrid, {
  ImageData,
} from "@/components/ui/img-sphere";

const BASE_IMAGES: Omit<ImageData, "id">[] = [
  {
    src: "https://images.unsplash.com/photo-1758178309498-036c3d7d73b3?auto=format&fit=crop&q=80&w=987",
    alt: "Image 1",
    title: "Mountain Landscape",
    description:
      "A beautiful landscape captured at golden hour with mountains in the background.",
  },
  {
    src: "https://images.unsplash.com/photo-1757647016230-d6b42abc6cc9?auto=format&fit=crop&q=80&w=2072",
    alt: "Image 2",
    title: "Portrait Photography",
    description:
      "Stunning portrait photography showcasing natural lighting and composition.",
  },
  {
    src: "https://images.unsplash.com/photo-1757906447358-f2b2cb23d5d8?auto=format&fit=crop&q=80&w=987",
    alt: "Image 3",
    title: "Urban Architecture",
    description:
      "Modern architectural design featuring clean lines and geometric patterns.",
  },
  {
    src: "https://images.unsplash.com/photo-1742201877377-03d18a323c18?auto=format&fit=crop&q=80&w=1064",
    alt: "Image 4",
    title: "Nature Scene",
    description:
      "Peaceful nature scene with vibrant colors and natural beauty.",
  },
  {
    src: "https://images.unsplash.com/photo-1757081791153-3f48cd8c67ac?auto=format&fit=crop&q=80&w=987",
    alt: "Image 5",
    title: "Abstract Art",
    description:
      "Creative abstract composition with bold colors and unique patterns.",
  },
  {
    src: "https://images.unsplash.com/photo-1757626961383-be254afee9a0?auto=format&fit=crop&q=80&w=987",
    alt: "Image 6",
    title: "Mountain Landscape",
    description:
      "A beautiful landscape captured at golden hour with mountains in the background.",
  },
  {
    src: "https://images.unsplash.com/photo-1756748371390-099e4e6683ae?auto=format&fit=crop&q=80&w=987",
    alt: "Image 7",
    title: "Portrait Photography",
    description:
      "Stunning portrait photography showcasing natural lighting and composition.",
  },
  {
    src: "https://images.unsplash.com/photo-1755884405235-5c0213aa3374?auto=format&fit=crop&q=80&w=987",
    alt: "Image 8",
    title: "Urban Architecture",
    description:
      "Modern architectural design featuring clean lines and geometric patterns.",
  },
  {
    src: "https://images.unsplash.com/photo-1757495404191-e94ed7e70046?auto=format&fit=crop&q=80&w=987",
    alt: "Image 9",
    title: "Nature Scene",
    description:
      "Peaceful nature scene with vibrant colors and natural beauty.",
  },
  {
    src: "https://images.unsplash.com/photo-1756197256528-f9e6fcb82b04?auto=format&fit=crop&q=80&w=1064",
    alt: "Image 10",
    title: "Abstract Art",
    description:
      "Creative abstract composition with bold colors and unique patterns.",
  },
  {
    src: "https://images.unsplash.com/photo-1534083220759-4c3c00112ea0?auto=format&fit=crop&q=80&w=987",
    alt: "Image 11",
    title: "Abstract Art",
    description:
      "Creative abstract composition with bold colors and unique patterns.",
  },
  {
    src: "https://images.unsplash.com/photo-1755278338891-e8d8481ff087?auto=format&fit=crop&q=80&w=1674",
    alt: "Image 12",
    title: "Abstract Art",
    description:
      "Creative abstract composition with bold colors and unique patterns.",
  },
];

const IMAGES: ImageData[] = Array.from({ length: 60 }, (_, i) => {
  const baseIndex = i % BASE_IMAGES.length;
  const baseImage = BASE_IMAGES[baseIndex];
  return {
    id: `img-${i + 1}`,
    ...baseImage,
    alt: `${baseImage.alt} (${Math.floor(i / BASE_IMAGES.length) + 1})`,
  };
});

const CONFIG = {
  containerSize: 600,
  sphereRadius: 200,
  dragSensitivity: 0.8,
  momentumDecay: 0.96,
  maxRotationSpeed: 6,
  baseImageScale: 0.15,
  hoverScale: 1.3,
  perspective: 1000,
  autoRotate: true,
  autoRotateSpeed: 0.2,
} as const;

export default function SphereImageGridDemo() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <SphereImageGrid images={IMAGES} {...CONFIG} />
    </main>
  );
}

