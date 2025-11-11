"use client";

import { BackgroundPaths } from "@/components/ui/background-paths";
import SphereImageGrid, {
  type ImageData,
} from "@/components/ui/img-sphere";

const BASE_SPHERE_IMAGES: Omit<ImageData, "id">[] = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800",
    alt: "Mountains at sunrise",
    title: "Guided by Discovery",
    description:
      "Exploring new terrains to understand how people live, work, and create.",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    alt: "Developer coding on laptop",
    title: "Engineered with Precision",
    description: "Building reliable systems that scale to millions of devices.",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800",
    alt: "Team collaborating",
    title: "Human-Centered",
    description:
      "Designing around real-world teams and the people that power them.",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800",
    alt: "Drone flying over coastline",
    title: "Expanded Horizons",
    description:
      "Blending hardware, software, and AI to reimagine intelligent products.",
  },
  {
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800",
    alt: "Modern skyline at dusk",
    title: "Global Perspective",
    description:
      "A network of partners and creators across six continents and growing.",
  },
  {
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
    alt: "Hardware prototyping lab",
    title: "Hardware Ready",
    description:
      "Rapid prototyping that moves from concept to production seamlessly.",
  },
  {
    src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=800",
    alt: "Team planning around a table",
    title: "Collaborative by Design",
    description: "Cross-discipline teams working together in real time.",
  },
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    alt: "Design sprint workshop",
    title: "Accelerated Delivery",
    description:
      "Sprint-based delivery that keeps progress visible and accountable.",
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=800",
    alt: "Laptop with code review",
    title: "Secure Foundations",
    description: "Every release is audited for resilience and privacy.",
  },
  {
    src: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&q=80&w=800",
    alt: "Robotics engineer soldering hardware",
    title: "Crafted Hardware",
    description:
      "Custom silicon and firmware tuned to maximize performance per watt.",
  },
  {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    alt: "Printed circuit boards stacked",
    title: "Manufacturing Ready",
    description:
      "Trusted supply partners delivering predictable, repeatable results.",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    alt: "Software deployment strategy",
    title: "Continuous Evolution",
    description:
      "Live feedback loops let us refine experiences long after launch day.",
  },
];

const HERO_SPHERE_IMAGES: ImageData[] = Array.from(
  { length: 48 },
  (_, index) => {
    const baseIndex = index % BASE_SPHERE_IMAGES.length;
    const baseImage = BASE_SPHERE_IMAGES[baseIndex];
    return {
      id: `about-img-${index + 1}`,
      ...baseImage,
      alt: `${baseImage.alt} (${Math.floor(index / BASE_SPHERE_IMAGES.length) + 1})`,
    };
  }
);

const SPHERE_CONFIG = {
  containerSize: 420,
  sphereRadius: 160,
  dragSensitivity: 0.72,
  momentumDecay: 0.95,
  maxRotationSpeed: 5,
  baseImageScale: 0.18,
  hoverScale: 1.25,
  perspective: 1100,
  autoRotate: true,
  autoRotateSpeed: 0.18,
} as const;

export default function AboutPage() {
  return (
    <main className="relative bg-neutral-950 text-white">
      <section className="relative">
        <BackgroundPaths title="Sense in Motion">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 text-center">
            <div className="flex w-full flex-col items-center gap-10 lg:hidden">
              <div className="space-y-6">
                <p className="text-lg font-semibold text-neutral-900/90 dark:text-white/90">
                  We accelerate intelligent hardware teams from first sketch to
                  scaled launch, blending industrial design, firmware, and AI
                  workflows under a single roof.
                </p>
                <p className="text-base text-neutral-800/80 dark:text-white/70">
                  Our studios craft immersive experiences that make advanced
                  compute approachable. From co-designing silicon with leading
                  partners to iterating on in-field telemetry, we remove
                  friction and give teams confidence to ship beautifully
                  considered products faster than ever before.
                </p>
                <p className="text-base text-neutral-800/80 dark:text-white/70">
                  Every engagement is grounded in measurable outcomes,
                  transparent roadmaps, and tooling that keeps stakeholders
                  aligned — whether they are across the lab or around the globe.
                </p>
              </div>
              <SphereImageGrid
                images={HERO_SPHERE_IMAGES}
                {...SPHERE_CONFIG}
                className="h-auto w-full max-w-[420px]"
              />
            </div>

            <div className="hidden w-full items-center justify-center lg:flex">
              <SphereImageGrid
                images={HERO_SPHERE_IMAGES}
                {...SPHERE_CONFIG}
                containerSize={540}
                sphereRadius={190}
                baseImageScale={0.2}
                className="h-auto w-full max-w-[560px]"
              />
            </div>
          </div>
        </BackgroundPaths>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl space-y-12 px-6 pb-24 pt-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Interdisciplinary at Our Core
            </h2>
            <p className="text-base text-white/70">
              Sense brings together industrial designers, embedded engineers,
              machine learning researchers, and supply chain partners to solve
              hardware challenges holistically. We run integrated sprints where
              silicon decisions, enclosure design, and onboard experiences are
              iterated together.
            </p>
            <p className="text-base text-white/70">
              This tight loop produces products that feel cohesive end-to-end —
              smart, responsive, and deeply attuned to the people who use them.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Built for Scale and Support
            </h2>
            <p className="text-base text-white/70">
              From the first engineering validation build to post-launch
              observability, our teams stay hands-on. We help you navigate
              compliance, manufacturing, and logistics while layering in
              telemetry, OTA updates, and AI-driven diagnostics that keep your
              fleet healthy.
            </p>
            <p className="text-base text-white/70">
              When markets shift, Sense gives you the insight to pivot quickly —
              and the tooling to bring your users along for the ride.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

