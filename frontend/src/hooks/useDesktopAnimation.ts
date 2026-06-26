"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

const MD_BREAKPOINT = 768;

/**
 * SSR-safe hook that determines whether desktop animations should run.
 * 
 * Returns:
 * - `isDesktop`: true when viewport width >= 768px
 * - `shouldAnimate`: true only when isDesktop AND user hasn't enabled reduced motion
 * 
 * On mobile or when prefers-reduced-motion is active, returns false for both,
 * ensuring zero Framer Motion overhead on small screens and accessible rendering.
 */
export function useDesktopAnimation() {
  const prefersReducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Initial check
    const checkWidth = () => setIsDesktop(window.innerWidth >= MD_BREAKPOINT);
    checkWidth();

    // Listen for resize
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return {
    isDesktop,
    shouldAnimate: isDesktop && !prefersReducedMotion,
  };
}
