"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import AnimatedIcon from "../../../assets/animatedicon.gif";

const MINIMUM_VISIBLE_DURATION = 3000;
const EXIT_DURATION = 400;

export function SplashScreen() {
  const [isMounted, setIsMounted] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const scheduleExit = () => {
      if (!startTimeRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, MINIMUM_VISIBLE_DURATION - elapsed);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsHiding(true);
        timeoutRef.current = setTimeout(() => setIsMounted(false), EXIT_DURATION);
      }, remaining);
    };

    if (document.readyState === "complete") {
      scheduleExit();
    } else {
      window.addEventListener("load", scheduleExit);
      return () => window.removeEventListener("load", scheduleExit);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`splash-screen ${isHiding ? "splash-screen--hide" : ""}`}>
      <Image
        src={AnimatedIcon}
        alt="Sense loading animation"
        priority
        unoptimized
        className="splash-screen__image"
      />
    </div>
  );
}
