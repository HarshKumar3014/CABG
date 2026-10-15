"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/* One easing vocabulary for the whole site. Motion that shares a curve
   reads as one system; mixing eases is what makes a page feel assembled
   from tutorials. */
export const ease = {
  out: "expo.out",
  inOut: "expo.inOut",
  soft: "power3.out",
} as const;

/* Every component that sets up a trigger used to call
   ScrollTrigger.refresh() on mount. Ten components meant ten full
   recalculations of every trigger on the page, which is both wasted
   work and a visible hitch in the scroll. Batch them into one. */
let refreshQueued = false;
export function queueRefresh() {
  if (refreshQueued || typeof window === "undefined") return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      refreshQueued = false;
      ScrollTrigger.refresh();
    });
  });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText };
