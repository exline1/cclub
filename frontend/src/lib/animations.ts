import type { Variants, Transition } from "framer-motion";

/* ─── Shared Transitions ─── */

const springSmooth: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

const easeCubic: Transition = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94],
};

/* ─── Container Variants ─── */

/** Parent orchestrator — wrap children that use individual variants */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Slower stagger for hero-level reveals */
export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

/* ─── Child / Element Variants ─── */

/** Fade up from below — the workhorse animation for sections, cards, text */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeCubic,
  },
};

/** Opacity-only fade — backgrounds, overlays, subtle reveals */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Slide in from the left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springSmooth,
  },
};

/** Slide in from the right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springSmooth,
  },
};

/** Scale-in — modals, popups, emphasized cards */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springSmooth,
  },
};

/** Navbar slide down from top */
export const navSlideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ─── Hover / Interaction Variants ─── */

/** Card hover — subtle lift + scale */
export const cardHover = {
  scale: 1.03,
  y: -4,
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

/** Icon hover — slight scale bump */
export const iconHover = {
  scale: 1.15,
  transition: { type: "spring" as const, stiffness: 400, damping: 15 },
};

/* ─── Viewport Defaults ─── */

/** Reusable viewport config for whileInView */
export const viewportOnce = {
  once: true,
  amount: 0.2 as const,
};

export const viewportOnceMore = {
  once: true,
  amount: 0.3 as const,
};
