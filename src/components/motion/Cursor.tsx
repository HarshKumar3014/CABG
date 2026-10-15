"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* A cursor that reports what the thing under it will do. Only mounts on
   devices with a real pointer; touch keeps the native behaviour. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.15, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.15, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    let hovering = false;
    let px = -1;
    let py = -1;

    // pointermove fires per frame; only tween when the state changes
    const setHover = (target: Element | null) => {
      const over = !!target?.closest?.("a, button, [data-cursor]");
      if (over === hovering) return;
      hovering = over;
      gsap.to(r, {
        overwrite: "auto",
        scale: over ? 1.9 : 1,
        borderColor: over ? "var(--accent)" : "var(--line-bright)",
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
      }
      px = e.clientX;
      py = e.clientY;
      dx(px);
      dy(py);
      rx(px);
      ry(py);
      setHover(e.target as Element);
    };

    // the page moves under a still pointer while scrolling, and no
    // pointermove arrives to say a link has slid underneath it
    let scrollRaf = 0;
    const onScroll = () => {
      if (!shown || scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        setHover(document.elementFromPoint(px, py));
      });
    };

    const leave = () => {
      shown = false;
      gsap.to([d, r], { autoAlpha: 0, duration: 0.2 });
    };

    // entering an embedded page (the live project frames) stops our
    // events arriving, so hide rather than leave a frozen ring behind
    const out = (e: MouseEvent) => {
      if (!e.relatedTarget || (e.relatedTarget as Element).tagName === "IFRAME") leave();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("mouseout", out);
    document.documentElement.classList.add("has-cursor");

    return () => {
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-9 w-9 rounded-full border border-line-bright opacity-0"
      />
    </>
  );
}
