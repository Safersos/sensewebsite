"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import HeroGif from "../../../assets/herovid.gif";

function AnimatedHero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = useMemo(() => ["SMART", "REVOLUTIONARY", "REAL", "WONDERFUL", "RELIABLE", "INCREDIBLE", "YOU MUST HAVE"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleIndex((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleIndex, titles]);

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 py-8 text-center sm:gap-7 sm:py-10">
        <Button variant="secondary" size="sm" className="gap-3 -mt-2 sm:-mt-4">
          Read our launch article <MoveRight className="h-4 w-4" />
        </Button>
        <Image
          src={HeroGif}
          alt="Sense neural animation"
          className="mx-auto h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-44 md:w-44"
          priority
        />
        <div className="flex flex-col gap-2 -mt-5 sm:-mt-7">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.1]">
            <span className="text-cyan-200">This is something</span>
            <span className="relative mt-2 flex w-full justify-center overflow-hidden text-center md:pb-3 md:pt-1">
              &nbsp;
              {titles.map((title, index) => (
                <motion.span
                  key={title}
                  className="absolute font-semibold text-white"
                  initial={{ opacity: 0, y: -100 }}
                  transition={{ type: "spring", stiffness: 50 }}
                  animate={
                    titleIndex === index
                      ? {
                        y: 0,
                        opacity: 1,
                      }
                      : {
                        y: titleIndex > index ? -150 : 150,
                        opacity: 0,
                      }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h2>
          <p className="text-base leading-relaxed text-white/70 sm:text-lg md:text-xl">
            Managing a small business today is already complex enough. Skip the friction of outdated trade workflows.
            Sense streamlines modern SMB operations so your team can focus on crafting experiences customers love.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="outline" className="gap-3 border-white/30 text-white hover:bg-white/10">
            Jump on a call <PhoneCall className="h-4 w-4" />
          </Button>
          <Button size="lg" className="gap-3 bg-white text-slate-900 hover:bg-white/90">
            Sign up here <MoveRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };

