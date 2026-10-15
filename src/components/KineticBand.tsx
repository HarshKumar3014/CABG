"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap, ease, queueRefresh } from "@/lib/gsap";
import { canAnimate } from "@/lib/motion-safety";

/* One line of type far wider than the screen. The page holds still
   while the line slides past, so the reader gets all of it — idea to
   someone's hands — before the scroll moves on. Each stage lights up as
   it arrives; the last one takes the accent.

   The server renders the words wrapped onto several lines, which is
   fully readable on its own. The pinned, sideways version is switched
   on from the client only when animation can actually run. */
export default function KineticBand({ words }: { words: string[] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    const t = track.current;
    if (!el || !st || !t || !canAnimate()) return;

    // switch from the wrapped layout to the pinned one
    t.classList.remove("flex-wrap", "shell");
    t.classList.add("w-max", "pl-[8vw]", "pr-[8vw]");
    st.classList.add("sticky", "top-0", "h-svh", "flex", "items-center", "overflow-hidden");
    el.classList.remove("py-20", "md:py-28");

    const travel = () => Math.max(0, t.scrollWidth - window.innerWidth);
    const size = () => {
      // a little extra hold at the end, so the last word gets read
      el.style.height = `${window.innerHeight + travel() + window.innerHeight * 0.35}px`;
    };
    size();

    const items = t.querySelectorAll<HTMLElement>("[data-word]");
    const arrows = t.querySelectorAll<HTMLElement>("[data-arrow]");
    const ctx = gsap.context(() => {
      gsap.set(items, { color: "var(--line-bright)" });
      gsap.set(arrows, { color: "var(--accent-dim)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(t, { x: () => -travel(), ease: "none", duration: 1 }, 0);

      items.forEach((w, i) => {
        const at = (i / Math.max(items.length - 1, 1)) * 0.85;
        tl.to(w, { color: "var(--text)", duration: 0.12, ease: ease.soft }, at);
        if (arrows[i]) tl.to(arrows[i], { color: "var(--accent)", duration: 0.1 }, at + 0.06);
      });
      tl.to(items[items.length - 1], { color: "var(--accent)", duration: 0.1 }, 0.92);
      tl.to({}, { duration: 0.3 }); // the end-hold
    }, el);

    /* Phones fire resize as the address bar slides in and out mid-scroll.
       Re-sizing the section then shifts everything below it under the
       reader's thumb, so only a width change counts. */
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (touch && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      size();
      queueRefresh();
    };
    window.addEventListener("resize", onResize);
    queueRefresh();

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      el.style.height = "";
      t.classList.add("flex-wrap", "shell");
      t.classList.remove("w-max", "pl-[8vw]", "pr-[8vw]");
      st.classList.remove("sticky", "top-0", "h-svh", "flex", "items-center", "overflow-hidden");
      el.classList.add("py-20", "md:py-28");
    };
  }, [words.length]);

  return (
    <section
      ref={root}
      aria-label={words.join(", then ")}
      className="relative py-20 md:py-28"
    >
      <div ref={stage}>
        <div
          ref={track}
          aria-hidden
          className="shell flex flex-wrap items-center gap-x-[0.35em] gap-y-2 text-[clamp(3.5rem,11vw,10rem)] font-[450] leading-[1] tracking-[-0.05em] text-text will-change-transform"
        >
          {words.map((w, i) => (
            <Fragment key={w}>
              <span data-word className="whitespace-nowrap">
                {w}
              </span>
              {i < words.length - 1 && (
                <span data-arrow className="text-accent-dim">
                  →
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
