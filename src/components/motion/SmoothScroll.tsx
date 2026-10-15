"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, prefersReducedMotion, queueRefresh } from "@/lib/gsap";

/* Weighted smooth scroll, driven off GSAP's ticker so ScrollTrigger and
   Lenis never disagree about where the page is. This is the single
   biggest contributor to how the site *feels* under the hand. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    /* Light smoothing only. A long ease looks good in a screen
       recording and feels broken under the hand — the page keeps
       gliding after the wheel has stopped. This takes the edge off
       without putting distance between the input and the page. */
    const lenis = new Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      syncTouch: false,
      // in-page links glide too, landing clear of the sticky nav
      anchors: { offset: -80 },
      // a glide still running when a route link is clicked would
      // otherwise drag the new page away from the top Next scrolls it to
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    // the intro may have started before this mounted
    if (document.documentElement.classList.contains("intro-lock")) lenis.stop();

    // Webfonts swap in after first layout and move every trigger.
    document.fonts?.ready.then(queueRefresh);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
