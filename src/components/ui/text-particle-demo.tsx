import { TextParticle } from "@/components/ui/text-particle";

export function TextParticlesDemo() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-center text-3xl font-bold">Text Particle</h1>

        <div className="h-64 w-full overflow-hidden rounded-lg border border-gray-200">
          <TextParticle
            text="Vercel"
            fontSize={150}
            particleColor="#3b82f6"
            particleSize={1}
            particleDensity={5}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-900">
            <TextParticle
              text="Nextjs"
              fontSize={100}
              particleColor="#f43f5e"
              particleSize={1}
              particleDensity={8}
              backgroundColor="#111827"
            />
          </div>
          <div className="h-48 w-full overflow-hidden rounded-lg border border-gray-200">
            <TextParticle
              text="Designali"
              fontSize={60}
              particleColor="#10b981"
              particleSize={1}
              particleDensity={4}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

