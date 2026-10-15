"use client";

import { gsap } from "./gsap";

/* Animation may only hide content when it can also be relied on to show
   it again. A background tab stops firing rAF, so GSAP's ticker never
   advances and anything mid-entrance stays invisible. Callers ask first. */
export function canAnimate() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return document.visibilityState === "visible";
}

/* Put elements into their finished state immediately. Transforms are
   cleared first and visibility set last: clearing visibility afterwards
   would hand the element back to the CSS rule that hides it. */
export function showNow(targets: gsap.TweenTarget) {
  gsap.set(targets, { clearProps: "transform,translate,rotate,scale" });
  gsap.set(targets, { autoAlpha: 1 });
}

/* An element on screen that is still hidden is stuck. One far below the
   fold is simply waiting for its scroll trigger, and must be left alone
   or every reveal on the page fires at once. */
const TRIGGER_POINT = 0.85; // matches the reveal ScrollTrigger start

function stuckOnScreen() {
  const line = window.innerHeight * TRIGGER_POINT;
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal], [data-hero]")
  ).filter((el) => {
    if (getComputedStyle(el).visibility !== "hidden") return false;
    const r = el.getBoundingClientRect();
    // past its own trigger line and still hidden: stuck, not waiting
    return r.top < line && r.bottom > 0;
  });
}

let armed = false;

/* Last line of defence, for a tween killed mid-flight or a tab that lost
   rAF part-way through an entrance. */
export function armRevealFailsafe(delay = 4000) {
  if (armed || typeof window === "undefined") return;
  armed = true;

  const sweep = () => {
    const stuck = stuckOnScreen();
    if (stuck.length) showNow(stuck);
  };

  window.setTimeout(sweep, delay);

  // Losing visibility mid-entrance freezes the ticker; show what is on
  // screen rather than leave the reader looking at nothing.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") sweep();
  });
}
