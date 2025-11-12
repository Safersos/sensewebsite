'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export const ElasticHueSlider: React.FC<ElasticHueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = 'Adjust Hue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const progress = (value - min) / (max - min);
  const thumbPosition = progress * 100;

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative flex w-full max-w-xs scale-50 flex-col items-center" ref={sliderRef}>
      {label && (
        <label htmlFor="hue-slider-native" className="mb-1 text-sm text-gray-300">
          {label}
        </label>
      )}
      <div className="relative flex h-5 w-full items-center">
        <input
          id="hue-slider-native"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer appearance-none bg-transparent"
          style={{ WebkitAppearance: 'none' }}
        />

        <div className="absolute left-0 z-0 h-1 w-full rounded-full bg-gray-700" />

        <div
          className="absolute left-0 z-10 h-1 rounded-full bg-blue-500"
          style={{ width: `${thumbPosition}%` }}
        />

        <motion.div
          className="absolute top-1/2 z-30 -translate-y-1/2 transform"
          style={{ left: `${thumbPosition}%` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: isDragging ? 20 : 30 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-xs text-gray-500"
        >
          {value}°
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface FeatureItemProps {
  name: string;
  value: string;
  position: string;
}

export interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
  variance?: number;
  flashFrequency?: number;
  flashDuration?: number;
}

export const Lightning: React.FC<LightningProps> = ({
  hue = 230,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  variance = 0.6,
  flashFrequency = 0.8,
  flashDuration = 0.35,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uVariance;
      uniform float uFlashFrequency;
      uniform float uFlashDuration;

      #define OCTAVE_COUNT 5

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * 0.1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));

          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= 1.8;
              amplitude *= 0.52;
          }
          return value;
      }

      vec4 boltContribution(vec2 uv, float seed, float timeFactor) {
          float phase = fract(timeFactor * uFlashFrequency + seed * 0.73);
          float active = smoothstep(uFlashDuration, uFlashDuration - 0.08, phase);
          if (active <= 0.0) {
            return vec4(0.0);
          }

          float baseOffset = (hash11(seed * 1.37) - 0.5) * (0.9 + uVariance * 0.5) + uXOffset;
          float arcStrength = mix(0.12, 0.28 + 0.12 * uVariance, hash11(seed * 2.17));
          float curve = arcStrength * sin(uv.y * (3.0 + uVariance * 1.8) + timeFactor * 0.25 + seed);
          float drift = (fbm(vec2(uv.y * (4.0 + seed * 0.05), timeFactor * 0.3 + seed * 0.91)) - 0.5) * (0.35 + uVariance * 0.35);
          float path = baseOffset + curve + drift;

          float segmentStart = hash11(seed * 3.11) * 0.7;
          float segmentLength = mix(0.22, 0.55, hash11(seed * 4.03));
          float lower = clamp(segmentStart, 0.0, 0.9);
          float upper = clamp(segmentStart + segmentLength, lower + 0.15, 1.0);
          float window = smoothstep(lower - 0.08, lower + 0.02, uv.y) * (1.0 - smoothstep(upper, upper + 0.1, uv.y));
          if (window <= 0.0) {
            return vec4(0.0);
          }

          float branchChance = hash11(seed * 5.97);
          float branchCurve = (sin(uv.y * 10.0 + seed * 1.3) * 0.12 + sin(uv.y * 4.2 - seed * 0.7) * 0.09) * branchChance * window;
          float dist = abs(uv.x - (path + branchCurve));

          float thickness = mix(0.02, 0.05 + uVariance * 0.03, uv.y);
          float bolt = exp(-dist * (120.0 / (1.0 + uVariance * 0.6))) * window * active * uIntensity;
          float halo = exp(-dist * 14.0) * 0.45 * window * active;

          float pulse = 0.75 + 0.45 * sin(timeFactor * 0.7 + seed * 1.9);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.45, 1.0));
          vec3 color = baseColor * (bolt * pulse * 1.3) + baseColor * halo * 0.95;
          color += vec3(0.55, 0.7, 1.0) * pow(max(0.0, 0.35 - dist), 3.5) * 0.35;

          float alpha = clamp(bolt * 1.2 + halo * 0.9, 0.0, 1.0);
          return vec4(color, alpha);
      }

      void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
          vec2 uv = fragCoord / iResolution.xy;
          uv.x = (uv.x - 0.5) * (iResolution.x / iResolution.y);
          uv.y = clamp(uv.y, 0.0, 1.0);

          float timeFactor = iTime * uSpeed;

          vec3 totalColor = vec3(0.0);
          float totalAlpha = 0.0;

          for (int i = 0; i < 3; ++i) {
            float seed = floor(timeFactor * uFlashFrequency) - float(i);
            vec4 contribution = boltContribution(uv, seed, timeFactor);
            totalColor += contribution.rgb * (1.0 - totalAlpha);
            totalAlpha = clamp(totalAlpha + contribution.a * (1.0 - totalAlpha), 0.0, 1.0);
          }

          fragColor = vec4(totalColor, totalAlpha);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const uHueLocation = gl.getUniformLocation(program, 'uHue');
    const uXOffsetLocation = gl.getUniformLocation(program, 'uXOffset');
    const uSpeedLocation = gl.getUniformLocation(program, 'uSpeed');
    const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity');
    const uSizeLocation = gl.getUniformLocation(program, 'uSize');
    const uVarianceLocation = gl.getUniformLocation(program, 'uVariance');
    const uFlashFrequencyLocation = gl.getUniformLocation(program, 'uFlashFrequency');
    const uFlashDurationLocation = gl.getUniformLocation(program, 'uFlashDuration');

    const startTime = performance.now();

    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);

      const currentTime = performance.now();
      gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0);
      gl.uniform1f(uHueLocation, hue);
      gl.uniform1f(uXOffsetLocation, xOffset);
      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uSizeLocation, size);
      gl.uniform1f(uVarianceLocation, variance);
      gl.uniform1f(uFlashFrequencyLocation, flashFrequency);
      gl.uniform1f(uFlashDurationLocation, flashDuration);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hue, xOffset, speed, intensity, size, variance, flashFrequency, flashDuration]);

  return <canvas ref={canvasRef} className="relative h-full w-full" />;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ name, value, position }) => {
  return (
    <div className={`group absolute ${position} z-10 transition-all duration-300 hover:scale-110`}>
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <div className="h-2 w-2 rounded-full bg-white group-hover:animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-white/20 blur-sm opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="relative text-white">
          <div className="font-medium transition-colors duration-300 group-hover:text-white">{name}</div>
          <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/70">{value}</div>
          <div className="absolute -inset-2 -z-10 rounded-lg bg-white/10 blur-md opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};

export const HeroSection: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightningHue, setLightningHue] = useState(220);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">
      <div className="relative z-20 mx-auto h-screen max-w-7xl px-4 py-6 text-white sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between rounded-full bg-black/50 px-4 py-4 backdrop-blur-3xl"
        >
          <div className="flex items-center">
            <div className="text-2xl font-bold">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M20 5L5 20L20 35L35 20L20 5Z" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div className="ml-8 hidden items-center space-x-6 md:flex">
              <button className="rounded-full bg-gray-800/50 px-4 py-2 text-sm transition-colors hover:bg-gray-700/50">
                Start
              </button>
              <button className="px-4 py-2 text-sm transition-colors hover:text-gray-300">Home</button>
              <button className="px-4 py-2 text-sm transition-colors hover:text-gray-300">Contacts</button>
              <button className="px-4 py-2 text-sm transition-colors hover:text-gray-300">Help</button>
              <button className="px-4 py-2 text-sm transition-colors hover:text-gray-300">Docs</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="hidden px-4 py-2 text-sm transition-colors hover:text-gray-300 md:block">Register</button>
            <button className="rounded-full bg-gray-800/80 px-4 py-2 text-sm transition-colors hover:bg-gray-700/80">
              Application
            </button>
            <button className="rounded-md p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </motion.div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-9999 fixed inset-0 z-50 bg-black/95 backdrop-blur-lg md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-lg">
              <button className="absolute right-6 top-6 p-2" onClick={() => setMobileMenuOpen(false)}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button className="rounded-full bg-gray-800/50 px-6 py-3">Start</button>
              <button className="px-6 py-3">Home</button>
              <button className="px-6 py-3">Contacts</button>
              <button className="px-6 py-3">Help</button>
              <button className="px-6 py-3">Docs</button>
              <button className="px-6 py-3">Register</button>
              <button className="rounded-full bg-gray-800/80 px-6 py-3 backdrop-blur-sm">Application</button>
            </div>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative top-[30%] z-200 w-full"
        >
          <motion.div variants={itemVariants}>
            <FeatureItem name="React" value="for base" position="left-0 top-40 sm:left-10" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="Tailwind" value="for styles" position="left-1/4 top-24" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="Framer-motion" value="for animations" position="right-1/4 top-24" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureItem name="Shaders" value="for lightning" position="right-0 top-40 sm:right-10" />
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-30 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <ElasticHueSlider value={lightningHue} onChange={setLightningHue} label="Adjust Lightning Hue" />

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group mb-6 flex items-center space-x-2 rounded-full bg-white/5 px-4 py-2 text-sm transition-all duration-300 hover:bg-white/10"
          >
            <span>Join us for free world</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transform transition-transform duration-300 group-hover:translate-x-1">
              <path d="M8 3L13 8L8 13M13 8H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>

          <motion.h1 variants={itemVariants} className="mb-2 text-5xl font-light md:text-7xl">
            Hero Odyssey
          </motion.h1>
          <motion.h2
            variants={itemVariants}
            className="pb-3 text-3xl font-light text-transparent md:text-5xl"
            style={{
              backgroundImage: 'linear-gradient(to right, #f8fafc, #e2e8f0, #cbd5f5)',
              WebkitBackgroundClip: 'text',
            }}
          >
            Lighting Up The Future
          </motion.h2>

          <motion.p variants={itemVariants} className="mb-9 max-w-2xl text-gray-400">
            Lightning animation is 100% code generated, so feel free to customize it to your liking.
          </motion.p>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-[100px] rounded-full bg-white/10 px-8 py-3 transition-colors hover:bg-white/20"
          >
            Discover Those Worlds
          </motion.button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute top-[55%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-500/20 to-purple-600/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2">
          <Lightning hue={lightningHue} xOffset={0} speed={1.6} intensity={0.6} size={2} />
        </div>
        <div className="absolute top-[55%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_25%_90%,_#1e386b_15%,_#000000de_70%,_#000000ed_100%)] backdrop-blur-3xl" />
      </motion.div>
    </div>
  );
};

export const DemoOne = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <HeroSection />
    </div>
  );
};


